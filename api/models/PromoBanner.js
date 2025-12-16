import mongoose from 'mongoose';

const promoBannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  imageUrl: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

promoBannerSchema.index({ isActive: 1 });
promoBannerSchema.index({ order: 1 });

export default mongoose.model('PromoBanner', promoBannerSchema);