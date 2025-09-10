// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // We are removing the custom 'id' field
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, default: 0 },
  isDemanded: { type: Boolean, default: false },
}); // We are also removing the '{ _id: false }' option

module.exports = mongoose.model('Product', ProductSchema);