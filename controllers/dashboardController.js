// controllers/dashboardController.js
const Product = require('../models/product');

// Get dashboard data: total product count (using name) and total product price
exports.getDashboardData = async (req, res) => {
  try {
    // Count total products based on unique names
    const totalProducts = await Product.aggregate([
      {
        $group: {
          _id: "$name"  // Group by product name
        }
      },
      {
        $count: "totalProducts"
      }
    ]);

    // Calculate total price of all products
    const totalPrice = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$price" }
        }
      }
    ]);

    res.status(200).send({
      totalProducts: totalProducts.length > 0 ? totalProducts[0].totalProducts : 0,
      totalPrice: totalPrice.length > 0 ? totalPrice[0].total : 0
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(400).send('Error fetching dashboard data');
  }
};
