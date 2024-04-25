const express = require("express");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const Product = require("../models/product");

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

// Create a new product
router.post(
  "/products",
  upload.single("pimage"),
  [
    body("product").notEmpty().withMessage("Product name is required"),
    body("price").isNumeric().withMessage("Price must be a numeric value"),
    body("qty").isInt().withMessage("Quantity must be an integer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { product, price, qty, desc, instock } = req.body;
      const pimage = req.file ? `/uploads/${req.file.filename}` : "";

      const newProduct = new Product({
        product,
        pimage,
        price,
        qty,
        desc,
        instock,
      });

      const savedProduct = await newProduct.save();

      res.status(201).json({
        message: "Product created successfully!",
        product: savedProduct,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the product." });
    }
  }
);

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find(); // Retrieve all products from the database
    res.status(200).json(products); // Send the products as a JSON response
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching products." });
  }
});

// Get a product by ID
router.get("/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Update a product by ID
router.put(
  "/products/:productId",
  upload.single("pimage"),
  [
    body("product")
      .optional()
      .notEmpty()
      .withMessage("Product name is required"),
    body("price").optional().isNumeric().withMessage("Price must be numeric"),
    body("qty").optional().isInt().withMessage("Quantity must be an integer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { productId } = req.params;
      const updatedProduct = req.body; // Data to update

      if (req.file) {
        updatedProduct.pimage = `/uploads/${req.file.filename}`; // Update image if needed
      }

      const product = await Product.findByIdAndUpdate(
        productId,
        updatedProduct,
        {
          new: true,
        }
      );

      if (product) {
        res.json({ message: "Product updated successfully", product });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  }
);

// Delete a product by ID
router.delete("/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);

    if (product) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
