const Register = require("../models/registration");
const express = require("express");
const router = express.Router();

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    // Check if the user exists
    const user = await Register.findOne({ email: req.body.email });

    console.log("User found:", user);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({
        success: false,
        msg: "Please Register your account",
        data: {},
      });
    }

    // Check if password matches
    const result = req.body.password === user.password;
    console.log("Password comparison result:", result);

    if (!result) {
      console.log("Password does not match");
      return res.status(400).json({
        success: false,
        msg: "Email or Password Does not Match",
        data: {},
      });
    }

    // Store user data in session

    // Send a success status code (200)
    res.status(200).json({
      success: true,
      msg: "Login Successful",
      data: user,
    });
    req.session.user = user;

    console.log("Login Successful", user);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      data: {},
    });
  }
});

// Check-login endpoint
router.get("/check-login", (req, res) => {
  try {
    if (req.session.user) {
      res.json({
        isLoggedIn: true,
        user: req.session.user,
      });
    } else {
      res.json({
        isLoggedIn: false,
      });
    }
  } catch (error) {
    console.error("Check-login error:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      data: {},
    });
  }
});

//profile

router.get("/user-details", async (req, res) => {
  console.log("Inside user-details route");
  try {
    console.log("User session:", req.session); // Log user session data

    // Check if the user is logged in
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized access",
        data: {},
      });
    }

    // Find the user by their ID
    const user = await Register.findById(req.session.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
        data: {},
      });
    }

    res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Get user details error:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      data: {},
    });
  }
});

// Update user profile endpoint
// Update user profile endpoint
router.put("/update-profile", async (req, res) => {
  console.log("Inside update-profile route");
  try {
    console.log("User session:", req.session); // Log user session data

    // Check if the user is logged in
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized access",
        data: {},
      });
    }

    // Find the user by their ID
    const user = await Register.findById(req.session.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
        data: {},
      });
    }

    // Update user data if provided in the request body
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }

    // Save the updated user data
    await user.save();

    res.json({
      success: true,
      msg: "Profile updated successfully",
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      data: {},
    });
  }
});

module.exports = router;
