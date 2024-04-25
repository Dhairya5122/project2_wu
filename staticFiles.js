const express = require("express");
const path = require("path");

const staticRouter = express.Router();

// Serve static files from "public" directory for general assets
staticRouter.use("/public", express.static(path.join(__dirname, "public")));

// Serve static files from "uploads" for user-uploaded files
staticRouter.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = staticRouter;
