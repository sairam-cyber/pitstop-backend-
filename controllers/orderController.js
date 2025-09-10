// controllers/orderController.js
const Order = require('../models/Order'); // Make sure to import the Order model
const sendEmail = require('../utils/mailer');
const User = require('../models/User');

// @desc    Create a new order
exports.createOrder = async (req, res) => {
    const { products, total } = req.body;

    try {
        const newOrder = new Order({
            user: req.user.id,
            products: products.map(p => ({ product: p._id, quantity: p.quantity })),
            total,
        });

        const order = await newOrder.save();
        res.status(201).json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// @desc    Get orders for logged in user
exports.getUserOrders = async (req, res) => {
    try {
        // Find orders belonging to the logged-in user
        const orders = await Order.find({ user: req.user.id }).sort({ date: -1 }); // Sort by most recent
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// @desc    Download an invoice (placeholder)
exports.downloadInvoice = (req, res) => {
    const { orderId } = req.params;
    // In a real app, you would generate a PDF here using a library like PDFKit
    res.json({ msg: `Invoice for order ${orderId} downloaded successfully (placeholder).` });
};

// @desc    Send order confirmation email
exports.sendOrderConfirmation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const { cart, total } = req.body;

    let productListHTML = cart
      .map(
        (item) => `
            <tr style="border-bottom: 1px solid #374151;">
                <td style="padding: 10px 0; color: #d1d5db;">${item.name} (x${item.quantity})</td>
                <td style="padding: 10px 0; color: #d1d5db; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
    `
      )
      .join('');

    const subject = 'Your MyStore Order Confirmation';
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
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
                                  <p style="font-size: 1rem; line-height: 1.6; color: #d1d5db;">Thank you for your order! Here are the details:</p>
                                  
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 1rem; margin-top: 20px;">
                                      ${productListHTML}
                                      <tr>
                                          <td style="padding: 20px 0 0 0; font-weight: bold; color: #ffffff; text-align: right;">Total</td>
                                          <td style="padding: 20px 0 0 0; font-weight: bold; color: #ffffff; text-align: right;">$${total.toFixed(2)}</td>
                                      </tr>
                                  </table>
                                  
                                  <p style="font-size: 1rem; line-height: 1.6; color: #d1d5db; margin-top: 30px;">We'll notify you once your order has shipped.</p>
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

    res.json({ msg: 'Order confirmation email sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};