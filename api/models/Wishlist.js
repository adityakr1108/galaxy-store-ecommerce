const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate wishlist items
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });
wishlistSchema.index({ userId: 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);