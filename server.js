/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import session from "express-session";
import { passport } from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import roomsRoutes from "./routes/rooms.js";
import booking from "./routes/booking.js";
import "dotenv/config";
import dashboardRoutes from "./routes/dashboard.js"

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = "localhost";

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ إعداد الـ Session
app.use(session({
  secret: process.env.JWT_SECRET || "fallback-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

console.log("✅ Using in-memory database for testing");

app.use("/api/rooms", roomsRoutes); 
app.use("/api/auth", authRoutes);   
app.use("/api", booking);
app.use("/api", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 RedSea Hotel Backend Server is Running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});


app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running perfectly!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.post("/api/test-signup", (req, res) => {
  console.log("📨 Test signup request:", req.body);

  res.json({
    success: true,
    message: "Test account created successfully!",
    token: "test-jwt-token-" + Date.now(),
    user: {
      id: 1,
      name: req.body.name,
      email: req.body.email,
      provider: "local",
      created_at: new Date().toISOString()
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    available_routes: [
      "GET  /",
      "GET  /api/health",
      "GET  /api/rooms",
      "POST /api/auth/signup",
      "POST /api/auth/login",
      "POST /api/test-signup"
    ]
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  });
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("🔗 Frontend URLs allowed:");
  console.log("   http://localhost:5173");
  console.log("   http://127.0.0.1:5173");
  console.log("   http://localhost:3000");
  console.log("   http://127.0.0.1:3000");
  console.log("📋 Available routes:");
  console.log("   GET  / - Server info");
  console.log("   GET  /api/health - Health check");
  console.log("   GET  /api/rooms - Get all available rooms");
  console.log("   POST /api/auth/signup - User registration");
  console.log("   POST /api/auth/login - User login");
  console.log("   POST /api/test-signup - Test endpoint");
});
