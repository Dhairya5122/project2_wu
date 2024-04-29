const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const Register = require("../models/registration");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// Login endpoint with redirect on success
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt with email:", email);

    const user = await Register.findOne({ email });

    if (!user) {
      console.log("User not found with email:", email); // Debugging user retrieval
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Optional: Log the stored hashed password for verification (only for debugging purposes)
    console.log("Stored hashed password for user:", user.password);

    // Hash the input password to compare with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password mismatch for email:", email); // Password didn't match
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    req.session.user = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Login error:", error); // Debugging unexpected errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Check-login endpoint to determine if a user is logged in
router.get("/check-login", (req, res) => {
  if (req.session.user) {
    return res.json({
      isLoggedIn: true,
      user: req.session.user, // You can send additional user info if needed
    });
  } else {
    return res.json({
      isLoggedIn: false,
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await Register.find(); // Fetch all users
    res.json(users); // Return the list of users
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/users/:userId/toggle", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await Register.findById(userId);

    if (user) {
      user.status = user.status === "active" ? "inactive" : "active";
      await user.save();
      res.json({ status: user.status }); // Return the updated status
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a user
router.delete("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await Register.findByIdAndDelete(userId);

    if (user) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({
        error: "Logout failed. Please try again later.",
      });
    }

    res.clearCookie("connect.sid"); // Clear the session cookie
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  });
});

module.exports = router;
