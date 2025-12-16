import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided. Access denied.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'Token is not valid. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Token is not valid.' });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      }
      next();
    });
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed.' });
  }
};

export const premiumAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (!req.user.isPremium && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied. Premium membership required.' });
      }
      next();
    });
  } catch (error) {
    console.error('Premium auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed.' });
  }
};