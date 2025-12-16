const express = require('express');
const Cart = require('../models/Cart.js');
const Product = require('../models/Product.js');
const { auth  } = require('../middleware/auth.js');
const { body, validationResult  } = require('express-validator');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    
    if (!cart) {
      return res.json({ items: [] });
    }

    // Filter out items where product no longer exists
    const validItems = cart.items.filter(item => item.productId);

    res.json({ items: validItems });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Server error fetching cart' });
  }
});

// Add item to cart
router.post('/add', auth, [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Check if product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.inStock || product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate('items.productId');

    res.json({
      message: 'Item added to cart successfully',
      items: cart.items
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error adding to cart' });
  }
});

// Update cart item quantity
router.put('/update', auth, [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (quantity === 0) {
      // Remove item
      cart.items = cart.items.filter(
        item => item.productId.toString() !== productId
      );
    } else {
      // Update quantity
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );
      
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        return res.status(404).json({ error: 'Item not found in cart' });
      }
    }

    await cart.save();
    await cart.populate('items.productId');

    res.json({
      message: 'Cart updated successfully',
      items: cart.items
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Server error updating cart' });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Server error clearing cart' });
  }
});

module.exports = router;