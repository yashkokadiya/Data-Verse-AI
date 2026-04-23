require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const rateLimit = require("express-rate-limit");

const app = express();

// ── Connect to MongoDB ──────────────────────────────────────────────────────
connectDB();

// ── Global Middleware ───────────────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    const allowed = [
      "http://localhost:8080",
      "http://localhost:5173",
      "http://localhost:3000",
    ];
    if (allowed.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());

// Global rate limiter (100 req / 15 min per IP)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
}));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (_req, res) =>
  res.json({ success: true, message: "DataVerse API is running 🚀" })
);

// 404 fallback
app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Route not found." })
);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// ── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅  Server running on http://localhost:${PORT}`));