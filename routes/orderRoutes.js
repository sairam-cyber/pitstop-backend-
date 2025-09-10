// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUserOrders,
  downloadInvoice,
  sendOrderConfirmation,
  createOrder // Import the new controller
} = require('../controllers/orderController');

// @route   POST api/orders
// @desc    Create a new order
router.post('/', auth, createOrder);

// @route   GET api/orders/myorders
// @desc    Get user's orders
router.get('/myorders', auth, getUserOrders);

// @route   GET api/orders/invoice/:orderId
// @desc    Download invoice for an order
router.get('/invoice/:orderId', auth, downloadInvoice);

// @route   POST api/orders/confirmation
// @desc    Send order confirmation email
router.post('/confirmation', auth, sendOrderConfirmation);

module.exports = router;