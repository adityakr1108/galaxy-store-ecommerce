const express = require('express');
const Order = require('../models/Order.js');
const Product = require('../models/Product.js');
const Cart = require('../models/Cart.js');
const { auth, adminAuth  } = require('../middleware/auth.js');
const { body, validationResult  } = require('express-validator');

const router = express.Router();

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error fetching order' });
  }
});

// Create new order
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  body('shippingAddress').trim().isLength({ min: 10, max: 500 }).withMessage('Shipping address is required'),
  body('location').trim().isLength({ min: 1 }).withMessage('Location is required'),
  body('couponCode').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shippingAddress, location, couponCode } = req.body;
    const userId = req.user._id;

    // Validate and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }

      if (!product.inStock || product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      subtotal += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        quantity: item.quantity
      });
    }

    // Calculate shipping (simplified - you can make this more complex)
    const shippingCost = location.toLowerCase().includes('remote') ? 100 : 50;

    // Apply coupon if provided (simplified)
    let discount = 0;
    if (couponCode) {
      // You can implement coupon validation here
      if (couponCode === 'SAVE10') discount = subtotal * 0.1;
      if (couponCode === 'FLAT100') discount = 100;
    }

    const total = subtotal - discount + shippingCost;

    // Create order
    const order = new Order({
      userId,
      items: orderItems,
      subtotal,
      discount,
      shippingCost,
      total,
      couponCode,
      shippingAddress,
      location,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      status: 'pending'
    });

    await order.save();

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { userId },
      { items: [] }
    );

    await order.populate('items.productId');

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error creating order' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', adminAuth, [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('items.productId');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error updating order status' });
  }
});

// Get all orders (admin only)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});

module.exports = router;