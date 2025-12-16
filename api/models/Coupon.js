import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    maxLength: 20
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'shipping'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    maxLength: 200
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxUsage: {
    type: Number,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ expiresAt: 1 });

export default mongoose.model('Coupon', couponSchema);