// E-commerce-platform-backend/controllers/productController.js
const Product = require('../models/Product');

// @desc    Get all demanded products
const getDemandedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDemanded: true });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all men's products
const getMenProducts = async (req, res) => {
  try {
    const products = await Product.find({ category: 'men' });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all women's products
const getWomenProducts = async (req, res) => {
  try {
    const products = await Product.find({ category: 'women' });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all kids' products
const getKidsProducts = async (req, res) => {
  try {
    const products = await Product.find({ category: 'kids' });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all beauty products
const getBeautyProducts = async (req, res) => {
  try {
    const products = await Product.find({ category: 'beauty' });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  getDemandedProducts,
  getMenProducts,
  getWomenProducts,
  getKidsProducts,
  getBeautyProducts
};