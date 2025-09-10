// E-commerce-platform-backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getDemandedProducts,
  getMenProducts,
  getWomenProducts,
  getKidsProducts,
  getBeautyProducts
} = require('../controllers/productController');

// @route   GET api/products/demanded
// @desc    Get all demanded products
// @access  Public
router.get('/demanded', getDemandedProducts);

// @route   GET api/products/men
// @desc    Get all men's products
// @access  Public
router.get('/men', getMenProducts);

// @route   GET api/products/women
// @desc    Get all women's products
// @access  Public
router.get('/women', getWomenProducts);

// @route   GET api/products/kids
// @desc    Get all kids' products
// @access  Public
router.get('/kids', getKidsProducts);

// @route   GET api/products/beauty
// @desc    Get all beauty products
// @access  Public
router.get('/beauty', getBeautyProducts);


module.exports = router;