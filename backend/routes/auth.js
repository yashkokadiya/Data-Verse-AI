const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { generateOtp, sendOtpEmail, sendWelcomeEmail } = require("../utils/email");

const router = express.Router();

// ── Helpers ──────────────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sendTokenResponse = (res, user, statusCode = 200, message = "Success") => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
  });
};

// ── Rate limiters ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many auth attempts. Try again in 15 minutes." },
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: { success: false, message: "Too many OTP requests. Wait 5 minutes." },
});

// ── Validation helper ────────────────────────────────────────────────────────
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return false;
  }
  return true;
};

// ── POST /api/auth/send-otp ──────────────────────────────────────────────────
router.post(
  "/send-otp",
  otpLimiter,
  [body("email").isEmail().withMessage("Valid email required").normalizeEmail()],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { email } = req.body;
      const existing = await User.findOne({ email });
      if (existing?.isVerified)
        return res.status(400).json({ success: false, message: "Email already registered." });

      const otp = generateOtp();
      let user = existing || new User({ email, password: "placeholder_will_be_replaced" });
      user.setOtp(otp);
      await user.save({ validateBeforeSave: false });
      await sendOtpEmail(email, otp);
      res.json({ success: true, message: "OTP sent to your email." });
    } catch (err) {
      console.error("send-otp error:", err);
      res.status(500).json({ success: false, message: "Failed to send OTP. Check email config." });
    }
  }
);

// ── POST /api/auth/verify-otp ────────────────────────────────────────────────
router.post(
  "/verify-otp",
  [
    body("email").isEmail().normalizeEmail(),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
  ],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email }).select("+otp.code +otp.expiresAt");
      if (!user) return res.status(404).json({ success: false, message: "Email not found." });
      if (!user.verifyOtp(otp))
        return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
      res.json({ success: true, message: "OTP verified." });
    } catch (err) {
      console.error("verify-otp error:", err);
      res.status(500).json({ success: false, message: "Server error." });
    }
  }
);

// ── POST /api/auth/signup ────────────────────────────────────────────────────
router.post(
  "/signup",
  authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail(),
    body("password")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/).withMessage("Need at least one uppercase letter")
      .matches(/[0-9]/).withMessage("Need at least one number"),
    body("confirmPassword").custom((val, { req }) => {
      if (val !== req.body.password) throw new Error("Passwords do not match");
      return true;
    }),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
    body("role").optional().isIn(["student", "professional"]),
  ],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { name, email, password, otp, role } = req.body;
      let user = await User.findOne({ email }).select("+otp.code +otp.expiresAt +password");

      if (!user)
        return res.status(400).json({ success: false, message: "Please request an OTP first." });
      if (user.isVerified)
        return res.status(400).json({ success: false, message: "Email already registered. Please log in." });
      if (!user.verifyOtp(otp))
        return res.status(400).json({ success: false, message: "Invalid or expired OTP." });

      user.name = name;
      user.password = password;
      user.role = role || "student";
      user.isVerified = true;
      user.otp = undefined;
      await user.save();

      sendWelcomeEmail(email, name).catch(console.error);
      sendTokenResponse(res, user, 201, "Account created successfully!");
    } catch (err) {
      console.error("signup error:", err);
      res.status(500).json({ success: false, message: "Signup failed. Please try again." });
    }
  }
);

// ── POST /api/auth/login ─────────────────────────────────────────────────────
router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user)
        return res.status(401).json({ success: false, message: "Invalid email or password." });
      if (!user.isVerified)
        return res.status(403).json({ success: false, message: "Please verify your email before logging in." });

      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(401).json({ success: false, message: "Invalid email or password." });

      user.lastLogin = new Date();
      user.loginCount += 1;
      await user.save({ validateBeforeSave: false });

      sendTokenResponse(res, user, 200, "Welcome back!");
    } catch (err) {
      console.error("login error:", err);
      res.status(500).json({ success: false, message: "Login failed. Please try again." });
    }
  }
);

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get("/me", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
router.post(
  "/forgot-password",
  otpLimiter,
  [body("email").isEmail().normalizeEmail()],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user || !user.isVerified)
        return res.json({ success: true, message: "If that email exists, an OTP has been sent." });

      const otp = generateOtp();
      user.setOtp(otp);
      await user.save({ validateBeforeSave: false });
      await sendOtpEmail(email, otp);
      res.json({ success: true, message: "If that email exists, an OTP has been sent." });
    } catch (err) {
      console.error("forgot-password error:", err);
      res.status(500).json({ success: false, message: "Server error." });
    }
  }
);

// ── POST /api/auth/reset-password ────────────────────────────────────────────
router.post(
  "/reset-password",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail(),
    body("otp").isLength({ min: 6, max: 6 }),
    body("newPassword").isLength({ min: 8 }).matches(/[A-Z]/).matches(/[0-9]/),
  ],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { email, otp, newPassword } = req.body;
      const user = await User.findOne({ email }).select("+otp.code +otp.expiresAt +password");
      if (!user || !user.verifyOtp(otp))
        return res.status(400).json({ success: false, message: "Invalid or expired OTP." });

      user.password = newPassword;
      user.otp = undefined;
      await user.save();
      res.json({ success: true, message: "Password reset successful. Please log in." });
    } catch (err) {
      console.error("reset-password error:", err);
      res.status(500).json({ success: false, message: "Server error." });
    }
  }
);

module.exports = router;