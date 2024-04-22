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

    const user = await Register.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    req.session.user = user;

    // Redirect to the home page after login
    return res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
});

// Check-login endpoint to determine if a user is logged in
router.get("/check-login", (req, res) => {
  if (req.session.user) {
    return res.json({
      isLoggedIn: true,
      user: req.session.user,
    });
  } else {
    return res.json({
      isLoggedIn: false,
    });
  }
});

module.exports = router;
