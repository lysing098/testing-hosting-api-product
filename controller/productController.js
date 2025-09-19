const Product = require("../model/productModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder name
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

exports.getAll = async (req, res) => {
  try {
    const products = await Product.find();
    const count = await Product.countDocuments();
    res.json({ count: count, products: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, qty } = req.body;
      const product = new Product({
        name,
        qty,
        image: req.file ? req.file.path : null,
      });
      await product.save();
      res
        .status(201)
        .json({ message: "Product create successfully", product: product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

// update
exports.update = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, qty } = req.body;

      // Find the existing product
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });

      // If new image uploaded, delete old image file
      if (req.file && product.image) {
        fs.unlink(product.image, (err) => {
          if (err) console.error("Failed to delete old image:", err.message);
        });
      }

      // Prepare update data
      const updateData = {
        name,
        qty,
      };
      if (req.file) updateData.image = req.file.path;

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];


// delete
exports.delete = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete image file if exists
    if (product.image) {
      fs.unlink(product.image, (err) => {
        if (err) console.error("Failed to delete image file:", err.message);
      });
    }

    res.json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


