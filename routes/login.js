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

module.exports = router;
