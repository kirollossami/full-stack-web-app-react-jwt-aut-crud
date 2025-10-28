/* eslint-disable no-undef */
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

const router = express.Router();

// Sign up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ success: false, message: "Invalid email format" });

    // Validate password strength
    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    const [existing] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(409).json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, phone, role, provider) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashed, phone || null, "user", "Website System"]
    );

    const token = jwt.sign(
      { userId: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: { 
          id: result.insertId, 
          name, 
          email, 
          phone: phone || null, 
          role: "user",
          provider: "Website System"
        },
        token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
});

// Login 
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const [users] = await db.execute(
      "SELECT id, name, email, password, phone, role, avatar, provider, created_at, updated_at FROM users WHERE email = ?", 
      [email]
    );
    
    if (users.length === 0)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const user = users[0];
    
    // Debug log (remove in production)
    console.log("Login attempt for:", email);
    console.log("Stored hash:", user.password ? "Exists" : "Missing");
    
    if (!user.password) {
      return res.status(401).json({ 
        success: false, 
        message: "Account issue - please contact support" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          provider: user.provider,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token)
      return res.status(401).json({ success: false, message: "Token required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await db.execute(
      "SELECT id, name, email, phone, role, avatar, provider, created_at, updated_at FROM users WHERE id = ?", 
      [decoded.userId]
    );

    if (users.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ 
      success: true, 
      data: { user: users[0] } 
    });
  } catch (error) {
    console.error("Get user error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// update client's profile
router.put("/update", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ success: false, message: "Token required" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { name, email, password, phone, avatar, provider } = req.body;

    // Check if new email already exists for other users
    if (email) {
      const [emailCheck] = await db.execute(
        "SELECT id FROM users WHERE email = ? AND id != ?", 
        [email, decoded.userId]
      );
      if (emailCheck.length > 0) {
        return res.status(409).json({ 
          success: false, 
          message: "Email already registered with another account" 
        });
      }
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push("phone = ?");
      values.push(phone);
    }
    if (provider) {
      updates.push("provider = ?");
      values.push(provider);
    }
    if (avatar) {
      updates.push("avatar = ?");
      values.push(avatar);
    }
    if (password && password.trim() !== "" && password !== "*******") {
      const hashed = await bcrypt.hash(password, 10);
      updates.push("password = ?");
      values.push(hashed);
    }

    if (updates.length === 0)
      return res.status(400).json({ success: false, message: "No fields to update" });

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(decoded.userId);

    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    await db.execute(query, values);

    const [updated] = await db.execute(
      "SELECT id, name, email, phone, role, avatar, provider, created_at, updated_at FROM users WHERE id = ?", 
      [decoded.userId]
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updated[0],
    });
  } catch (error) {
    console.error("Update error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    res.status(500).json({ success: false, message: "Server error during update" });
  }
});

// Logout 
router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;