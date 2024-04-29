const Register = require("../models/registration");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

// Endpoint to register new users
router.post("/register", async (req, res) => {
  try {
    const { username, name, email, password, mobile } = req.body;

    if (!username || !name || !email || !password || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Encrypt password

    const newUser = new Register({
      username,
      name,
      email,
      mobile, // Ensure 'mobile' is included
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle unique constraint error
      return res.status(400).json({
        success: false,
        message: `Duplicate entry: ${Object.keys(error.keyValue).join(", ")}`,
      });
    }

    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
