const Product = require("../model/productModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Single uploads folder
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// --- Controllers ---

// Get all products
exports.getAll = async (req, res) => {
  try {
    const products = await Product.find();
    const count = await Product.countDocuments();
    res.json({ count, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create product
exports.create = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, qty } = req.body;
      const product = new Product({
        name,
        qty,
        image: req.file ? `/uploads/${req.file.filename}` : null,
      });
      await product.save();
      res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

// Update product
exports.update = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, qty } = req.body;
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });

      // Delete old image
      if (req.file && product.image) {
        const oldPath = path.join(__dirname, "..", product.image.replace(/^\//, ""));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const updateData = { name, qty };
      if (req.file) updateData.image = `/uploads/${req.file.filename}`;

      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

// Delete product
exports.delete = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete image
    if (product.image) {
      const filePath = path.join(__dirname, "..", product.image.replace(/^\//, ""));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.upload = upload;
