const express = require("express");
const { isValidObjectId } = require("mongoose"); // To validate ObjectId
const Product = require("../models/product"); // Import your Product model

const router = express.Router();

router.get("/productdetails/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    // Validate the product ID
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ error: "Invalid Product ID" });
    }

    // Fetch product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return product details
    res.status(200).json(product);
    console.log("1", product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
