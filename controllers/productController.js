const Product = require('../models/product');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('image');  // single file upload

// Create a new product
exports.createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(400).send(err);
    }

    try {
      const product = new Product({
        name: req.body.name,
        image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
        price: req.body.price,
        description: req.body.description
      });

      await product.save();
      res.status(201).send(product);
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(400).send(err);
    }
  });
};

// Get all products with pagination
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();

    res.status(200).send({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(400).send(err);
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.status(200).send(product);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(400).send(err);
    }

    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send('Product not found');
      }

      product.name = req.body.name;
      product.image = req.file ? `/uploads/${req.file.filename}` : product.image;
      product.price = req.body.price;
      product.description = req.body.description;

      await product.save();
      res.status(200).send(product);
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(400).send(err);
    }
  });
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).send('Product not found');
    }
    res.status(200).send('Product deleted');
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(400).send('Error deleting product');
  }
};
