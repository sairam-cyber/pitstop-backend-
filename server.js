// server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path'); // Import the path module

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Make the 'uploads' folder publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/user', require('./routes/userRoutes')); // Add this
app.use('/api/orders', require('./routes/orderRoutes')); // Add this

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));