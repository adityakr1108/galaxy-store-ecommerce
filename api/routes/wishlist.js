import express from 'express';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { auth } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ userId: req.user._id })
      .populate('productId')
      .sort({ addedAt: -1 });

    const items = wishlistItems.filter(item => item.productId); // Filter out items where product was deleted

    res.json({ items });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Server error fetching wishlist' });
  }
});

// Add item to wishlist
router.post('/add', auth, [
  body('productId').isMongoId().withMessage('Valid product ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.body;
    const userId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({ userId, productId });
    if (existingItem) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    const wishlistItem = new Wishlist({ userId, productId });
    await wishlistItem.save();
    await wishlistItem.populate('productId');

    res.status(201).json({
      message: 'Product added to wishlist successfully',
      item: wishlistItem
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Server error adding to wishlist' });
  }
});

// Remove item from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const deleted = await Wishlist.findOneAndDelete({ userId, productId });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found in wishlist' });
    }

    res.json({ message: 'Product removed from wishlist successfully' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Server error removing from wishlist' });
  }
});

// Clear wishlist
router.delete('/', auth, async (req, res) => {
  try {
    await Wishlist.deleteMany({ userId: req.user._id });
    res.json({ message: 'Wishlist cleared successfully' });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ error: 'Server error clearing wishlist' });
  }
});

export default router;