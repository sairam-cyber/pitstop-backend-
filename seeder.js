// E-commerce-platform-backend/seeder.js
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const products = require('./utils/data');

// Connect to the database
connectDB();

const importData = async () => {
  try {
    // 1. Clear all existing products from the database
    await Product.deleteMany();

    // 2. Insert all the products from utils/data.js into the database
    await Product.insertMany(products);

    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error}`);
    process.exit(1);
  }
};

// Check for a command-line argument to decide whether to import or destroy
if (process.argv[2] === '-d') {
  // Optional: Add logic to destroy data if needed
} else {
  importData();
}