const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const crypto = require("crypto");

const registrationRoutes = require("./routes/registration");
const loginRoutes = require("./routes/login");
const productRoutes = require("./routes/product");
const productdetailsRoutes = require("./routes/productdetails");

const app = express();

// Import the new static middleware
const staticFiles = require("./staticFiles");

// Use the static middleware in the Express app
app.use(staticFiles);

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

app.get("/views/front/images/logo/4.png", (req, res) => {
  res.sendFile(path.join(__dirname, "views/front/images/logo/4.png"));
});

app.get("/service-worker-register.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public/service-worker-register.js"));
});

app.get("/manifest.json", (req, res) => {
  res.sendFile(path.join(__dirname, "public/manifest.json"));
});

app.get("/service-worker.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public/service-worker.js"));
});

// Set up middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from "views/front"
app.use("/", express.static(path.join(__dirname, "views/front")));
app.use("/productdetails", express.static(path.join(__dirname, "views/front")));

// Serve static files for the admin section
app.use("/admin", express.static(path.join(__dirname, "views/admin")));

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// Route for serving the login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/front", "login.html"));
});

app.get("/productdetails/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "views/front", "product-details.html"));
});

// Route for the Backend Process
app.get("/admin/index", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin", "index.html"));
});

app.get("/admin/category", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin", "categoryform.html"));
});
app.get("/admin/product", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin", "product.html"));
});

// Use routes for registration and login APIs
app.use("/api", loginRoutes);
app.use("/", registrationRoutes);
app.use("/", productRoutes);
app.use("/api", productdetailsRoutes);

module.exports = app;
