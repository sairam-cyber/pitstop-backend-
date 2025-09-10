// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user profile
exports.updateUserProfile = async (req, res) => {
  const { name, email, mobile } = req.body;
  const profileFields = { name, email, mobile };

  try {
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Upload user avatar to Cloudinary
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a file' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // The secure URL is provided by multer-storage-cloudinary in req.file.path
    user.avatar = req.file.path;
    
    await user.save();
    
    // Return the updated user profile
    res.json(await User.findById(req.user.id).select('-password'));

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user address
exports.updateUserAddress = async (req, res) => {
    // UPDATED: Include new fields
    const { name, street, city, state, zip, country } = req.body;
    const address = { name, street, city, state, zip, country };

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { address: address } },
            { new: true }
        ).select('-password');
        res.json(user.address);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Change user password
exports.changePassword = async (req, res) => {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};