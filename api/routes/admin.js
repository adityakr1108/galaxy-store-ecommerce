import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Admin dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      totalCoupons,
      pendingOrders,
      recentOrders
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Coupon.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name email')
    ]);

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['processing', 'shipped', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get monthly sales data for charts
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalCoupons,
        pendingOrders,
        totalRevenue
      },
      recentOrders,
      monthlyStats
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Server error fetching admin stats' });
  }
});

// Get low stock products
router.get('/low-stock', adminAuth, async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      stock: { $lte: 10, $gt: 0 }
    }).sort({ stock: 1 });

    res.json({ products: lowStockProducts });
  } catch (error) {
    console.error('Low stock error:', error);
    res.status(500).json({ error: 'Server error fetching low stock products' });
  }
});

// Get sales analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [
      salesByCategory,
      topProducts,
      dailySales
    ] = await Promise.all([
      // Sales by category
      Order.aggregate([
        { $match: matchStage },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: '$product.category',
            totalSales: { $sum: { $multiply: ['$product.price', '$items.quantity'] } },
            totalQuantity: { $sum: '$items.quantity' }
          }
        },
        { $sort: { totalSales: -1 } }
      ]),

      // Top selling products
      Order.aggregate([
        { $match: matchStage },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            totalQuantity: { $sum: '$items.quantity' }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' }
      ]),

      // Daily sales
      Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            totalSales: { $sum: '$total' },
            orderCount: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ])
    ]);

    res.json({
      salesByCategory,
      topProducts,
      dailySales
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Server error fetching analytics' });
  }
});

export default router;