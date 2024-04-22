const Register = require("../models/registration");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Endpoint to register new users
router.post("/register", async (req, res) => {
  try {
    const { username, name, mobile, email, password } = req.body;

    // Validate input
    if (!username || !name || !mobile || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newUser = new Register({
      username,
      name,
      mobile,
      email,
      password,
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      const errorKeys = Object.keys(err.errors);
      const duplicateKey = errorKeys.find(
        (key) => err.errors[key].kind === "unique"
      );

      if (duplicateKey) {
        return res.status(400).json({
          success: false,
          message: `Duplicate entry for ${duplicateKey}. Please use a different ${duplicateKey}.`,
        });
      }
    }

    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
