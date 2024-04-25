
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const crypto = require("crypto");

const registrationRoutes = require("./routes/registration");
const loginRoutes = require("./routes/login");

const app = express();

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString("hex");

// Log the secret key for debugging (be careful not to log in production)
console.log("Generated secret key:", secretKey);

// Set up session middleware
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
  })
);

// Set up middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from "views/front"
app.use(express.static(path.join(__dirname, "views/front")));

// Serve the service worker
app.get('/sw.js', (req, res) => {
  res.sendFile(path.join(__dirname, "views/front", "sw.js"));
});

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// Route for serving the login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/front", "login.html"));
});

// Use routes for registration and login APIs
app.use("/api", loginRoutes);
app.use("/", registrationRoutes);

module.exports = app;