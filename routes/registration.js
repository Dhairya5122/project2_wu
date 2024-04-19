const Register = require("../models/registration");
const express = require("express");
const router = express.Router();

// Creating New User (Register)
router.post("/register", async (req, res) => {
  try {
    const { username, name, mobile, email, password } = req.body;

    console.log(req.body);

    if (!username || !name || !mobile || !email || !password) {
      // Sending response with error flag
      return res.status(400).json({
        success: false,
        error: "Please send all data",
      });
    }

    const newRegister = new Register({
      username,
      name,
      mobile,
      email,
      password,
    });

    await newRegister.save();
    console.log("success");

    // Sending response with success flag
    await newRegister.save();

    return res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    console.log(err);

    // Sending response with error flag
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

module.exports = router;
