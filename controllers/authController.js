// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mailer'); // Import the sendEmail function
require('dotenv').config();
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// ADD THIS NEW FUNCTION for Google Login
exports.googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { name, email, sub: googleId, picture } = ticket.getPayload();
  
      let user = await User.findOne({ googleId });
  
      if (!user) {
        // If no user with this googleId, check if one exists with the same email
        user = await User.findOne({ email });
        if (user) {
          // If user with email exists, link the googleId to their account
          user.googleId = googleId;
          user.avatar = user.avatar || picture; // Update avatar if not set
          await user.save();
        } else {
          // If no user exists at all, create a new one
          user = new User({
            googleId,
            name,
            email,
            avatar: picture,
          });
          await user.save();
        }
      }
  
      const payload = {
        user: {
          id: user.id,
        },
      };
  
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1d' },
        (err, appToken) => {
          if (err) throw err;
          res.json({ token: appToken });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
};
// Signup Controller
exports.signup = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      mobile,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // --- Send Welcome Email ---
    const subject = 'Welcome to MyStore!';
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to PitStop!</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #111827;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td style="padding: 40px 20px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="width: 100%; max-width: 600px; color: #e5e7eb;">
                            <tr>
                                <td align="center" style="padding-bottom: 30px; text-align: center;">
                                    <h1 style="font-size: 2.5rem; font-weight: bold; color: #4f46e5; margin: 0;">PitStop</h1>
                                    <p style="font-size: 1rem; color: #9ca3af; margin: 5px 0 0 0;">Quality is Our Priority</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: #1f2937; border: 1px solid #374151; border-radius: 16px; padding: 30px;">
                                    <h2 style="font-size: 1.75rem; font-weight: 700; color: #ffffff; margin-top: 0;">Hi ${name},</h2>
                                    <p style="font-size: 1rem; line-height: 1.6; color: #d1d5db;">Thank you for signing up for MyStore. We're excited to have you!</p>
                                    <p style="font-size: 1rem; line-height: 1.6; color: #d1d5db;">Thanks,<br>The PitStop Team</p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding-top: 30px; text-align: center; font-size: 0.8rem; color: #6b7280;">
                                    <p style="margin:0;">&copy; 2025 PitStop. All Rights Reserved.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
    sendEmail(email, subject, html);
    // -------------------------

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // --- Send Login Notification ---
    const subject = 'New Login to Your MyStore Account';
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Login Alert</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #111827;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td style="padding: 40px 20px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="width: 100%; max-width: 600px; color: #e5e7eb;">
                            <tr>
                                <td align="center" style="padding-bottom: 30px; text-align: center;">
                                    <h1 style="font-size: 2.5rem; font-weight: bold; color: #4f46e5; margin: 0;">PitStop</h1>
                                    <p style="font-size: 1rem; color: #9ca3af; margin: 5px 0 0 0;">Quality is Our Priority</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: #1f2937; border: 1px solid #374151; border-radius: 16px; padding: 30px;">
                                    <h2 style="font-size: 1.75rem; font-weight: 700; color: #ffffff; margin-top: 0;">Hi ${user.name},</h2>
                                    <p style="font-size: 1rem; line-height: 1.6; color: #d1d5db;">We detected a new login to your account. If this was not you, please secure your account immediately.</p>
                                    <p style="font-size: 1rem; line-height: 1.6; color: #d1d5db;">Thanks,<br>The PitStop Team</p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding-top: 30px; text-align: center; font-size: 0.8rem; color: #6b7280;">
                                    <p style="margin:0;">&copy; 2025 PitStop. All Rights Reserved.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
    sendEmail(email, subject, html);
    // -----------------------------

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Forgot Password Controller
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send email
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const subject = 'Password Reset Request';
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset Request</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #111827;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="padding: 40px 20px;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="width: 100%; max-width: 600px; color: #e5e7eb;">
                                <tr>
                                    <td align="center" style="padding-bottom: 30px; text-align: center;">
                                        <h1 style="font-size: 2.5rem; font-weight: bold; color: #4f46e5; margin: 0;">PitStop</h1>
                                        <p style="font-size: 1rem; color: #9ca3af; margin: 5px 0 0 0;">Quality is Our Priority</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #1f2937; border: 1px solid #374151; border-radius: 16px; padding: 30px;">
                                        <h2 style="font-size: 1.75rem; font-weight: 700; color: #ffffff; margin-top: 0;">Hi ${user.name},</h2>
                                        <p style="font-size: 1rem; line-height: 1.6; color: #d1d5db;">We received a request to reset the password for your PitStop account. You can reset your password by clicking the button below.</p>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="center" style="padding: 30px 0; text-align: center;">
                                                    <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 15px 30px; font-size: 1rem; font-weight: 600; text-decoration: none; border-radius: 999px;">Reset Your Password</a>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="font-size: 1rem; line-height: 1.6; color: #d1d5db;">This password reset link is valid for one hour. If you did not request a password reset, please ignore this email.</p>
                                        <p style="font-size: 1rem; line-height: 1.6; color: #d1d5db;">Thanks,<br>The PitStop Team</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 30px; text-align: center; font-size: 0.8rem; color: #6b7280;">
                                        <p style="margin:0;">&copy; 2025 PitStop. All Rights Reserved.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        sendEmail(user.email, subject, html);

        res.json({ msg: 'Email sent' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Reset Password Controller
exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ msg: 'Password reset token is invalid or has expired' });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        
        // Send confirmation email
        const subject = 'Your password has been changed';
        const html = `
            <h1>Hi ${user.name},</h1>
            <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>
        `;
        sendEmail(user.email, subject, html);

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};