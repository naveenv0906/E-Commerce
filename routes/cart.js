const express = require('express');
const router = express.Router();
const Product = require('../models/product');

let cart = [];

router.post('/add', async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    cart.push(product);
    res.status(200).send(cart);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/buy', (req, res) => {
  try {
    cart = [];
    res.status(200).send('Purchase completed');
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
