const express = require('express');
const User = require('../models/User.js');
const { auth, adminAuth  } = require('../middleware/auth.js');

const router = express.Router();

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, updatedAt: Date.now() },
      { new: true, select: '-password' }
    );

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// Toggle premium status (admin only)
router.patch('/:id/premium', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isPremium = !user.isPremium;
    await user.save();

    res.json({
      message: `User premium status ${user.isPremium ? 'activated' : 'deactivated'}`,
      user: { ...user.toObject(), password: undefined }
    });
  } catch (error) {
    console.error('Toggle premium error:', error);
    res.status(500).json({ error: 'Server error updating premium status' });
  }
});

module.exports = router;