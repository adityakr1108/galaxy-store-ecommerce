import express from 'express';
import Coupon from '../models/Coupon.js';
import { adminAuth } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all coupons (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ coupons });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ error: 'Server error fetching coupons' });
  }
});

// Validate coupon
router.get('/validate/:code', async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ 
      code: req.params.code.toUpperCase(),
      isActive: true,
      $or: [
        { expiresAt: { $gte: new Date() } },
        { expiresAt: null }
      ]
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid or expired coupon' });
    }

    // Check usage limit
    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    res.json({ 
      valid: true, 
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ error: 'Server error validating coupon' });
  }
});

// Create coupon (admin only)
router.post('/', adminAuth, [
  body('code').trim().isLength({ min: 3, max: 20 }).withMessage('Code must be 3-20 characters'),
  body('type').isIn(['percentage', 'fixed', 'shipping']).withMessage('Invalid coupon type'),
  body('value').isFloat({ min: 0 }).withMessage('Value must be positive'),
  body('description').trim().isLength({ min: 1, max: 200 }).withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const couponData = {
      ...req.body,
      code: req.body.code.toUpperCase()
    };

    const coupon = new Coupon(couponData);
    await coupon.save();

    res.status(201).json({
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Server error creating coupon' });
  }
});

// Update coupon (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json({
      message: 'Coupon updated successfully',
      coupon
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ error: 'Server error updating coupon' });
  }
});

// Delete coupon (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ error: 'Server error deleting coupon' });
  }
});

export default router;