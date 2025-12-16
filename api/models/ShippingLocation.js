const mongoose = require('mongoose');

const shippingLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  days: {
    type: Number,
    required: true,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

shippingLocationSchema.index({ name: 1 });
shippingLocationSchema.index({ isActive: 1 });

module.exports = mongoose.model('ShippingLocation', shippingLocationSchema);