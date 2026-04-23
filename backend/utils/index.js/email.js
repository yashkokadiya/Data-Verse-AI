
const nodemailer = require("nodemailer");

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const generateOtp = () =>
  Math.floor(100_000 + Math.random() * 900_000).toString();

const sendOtpEmail = async (to, otp) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"DataVerse AI" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${otp} — Your DataVerse verification code`,
    html: `<div style="font-family:sans-serif;text-align:center;padding:40px;">
      <h2>DataVerse AI</h2>
      <p>Your verification code (expires in 10 min):</p>
      <h1 style="letter-spacing:12px;color:#6c63ff;">${otp}</h1>
    </div>`,
  });
};

const sendWelcomeEmail = async (to, name) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"DataVerse AI" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to DataVerse AI 🚀",
    html: `<p>Hi ${name || "there"} 👋 — your account is verified. Welcome aboard!</p>`,
  });
};

module.exports = { generateOtp, sendOtpEmail, sendWelcomeEmail };