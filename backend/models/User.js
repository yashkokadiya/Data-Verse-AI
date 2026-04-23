const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned in queries by default
    },
    role: {
      type: String,
      enum: ["student", "professional"],
      default: "student",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: { type: String, select: false },
      expiresAt: { type: Date, select: false },
    },
    lastLogin: {
      type: Date,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ── Hash password before save ─────────────────────────────────────────────
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare plain password ───────────────────────────────
UserSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// ── Instance method: set a new OTP ───────────────────────────────────────
UserSchema.methods.setOtp = function (code) {
  this.otp = {
    code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  };
};

// ── Instance method: verify OTP ──────────────────────────────────────────
UserSchema.methods.verifyOtp = function (inputCode) {
  if (!this.otp?.code || !this.otp?.expiresAt) return false;
  if (new Date() > this.otp.expiresAt) return false;
  return this.otp.code === inputCode;
};

module.exports = mongoose.model("User", UserSchema);