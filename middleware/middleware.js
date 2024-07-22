const express = require('express');
const middleware = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const productRoutes = require('../routes/product');

// Middleware
middleware.use('/views', express.static(path.join(__dirname, 'views')));
middleware.use('/uploads', express.static(path.join(__dirname, 'uploads')));
middleware.use(cors());
middleware.use(bodyParser.json());
middleware.use(bodyParser.urlencoded({ extended: true }));
middleware.use('/products', productRoutes);


module.exports = middleware;
