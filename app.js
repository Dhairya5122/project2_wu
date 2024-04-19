const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session"); // Import express-session
const routes = require("./routes/registration"); // assuming your registration routes are in this file
const loginRoutes = require("./routes/login"); // assuming your login routes are in this file
// const profileRoutes = require("./routes/profile"); // assuming your profile routes are in this file
const crypto = require("crypto"); // Import crypto module

const app = express();

// Serve static files from the "front" directory
const front = path.join(__dirname, "views", "front");
app.use(express.static(front));

const back = path.join(__dirname, "views", "admin");
app.use("/admin", express.static(back));

// Routes for Frontend
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/front", "login.html"));
});

//Routes For Backend
app.get("/category", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin", "categoryform.html"));
});

// Set the view engine to render HTML
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(bodyParser.urlencoded({ extended: true }));

// Generate a random secret key for session encryption
const secretKey = crypto.randomBytes(32).toString("hex");

// Set up session middleware
app.use(
  session({
    secret: secretKey, // Use the generated secret key
    resave: false,
    saveUninitialized: false,
  })
);

// Mount the registration routes
app.use("/", routes);

// Mount the login routes
app.use("/api", loginRoutes); // Assuming you want to prefix your login routes with "/api"
// app.use("/", profileRoutes); // Assuming you want to prefix your login routes with "/api"

module.exports = app;
