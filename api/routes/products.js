const express = require('express');
const { body, validationResult, query  } = require('express-validator');
const Product = require('../models/Product.js');
const { auth, adminAuth, premiumAuth  } = require('../middleware/auth.js');

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('category').optional().trim(),
  query('brand').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('search').optional().trim(),
  query('isPremium').optional().isBoolean().toBoolean(),
  query('isTrending').optional().isBoolean().toBoolean(),
  query('inStock').optional().isBoolean().toBoolean(),
  query('sortBy').optional().isIn(['name', 'price', 'rating', 'createdAt']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      isPremium,
      isTrending,
      inStock,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = new RegExp(category, 'i');
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }
    if (isPremium !== undefined) filter.isPremiumExclusive = isPremium;
    if (isTrending !== undefined) filter.isTrending = isTrending;
    if (inStock !== undefined) filter.inStock = inStock;
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error fetching products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error fetching product' });
  }
});

// Get trending products
router.get('/trending/list', async (req, res) => {
  try {
    const products = await Product.find({ 
      isTrending: true, 
      inStock: true 
    })
    .sort({ rating: -1, createdAt: -1 })
    .limit(20)
    .lean();

    res.json({ products });
  } catch (error) {
    console.error('Get trending products error:', error);
    res.status(500).json({ error: 'Server error fetching trending products' });
  }
});

// Get premium products (requires premium access or admin)
router.get('/premium/list', premiumAuth, async (req, res) => {
  try {
    const products = await Product.find({ 
      isPremiumExclusive: true, 
      inStock: true 
    })
    .sort({ rating: -1, createdAt: -1 })
    .limit(20)
    .lean();

    res.json({ products });
  } catch (error) {
    console.error('Get premium products error:', error);
    res.status(500).json({ error: 'Server error fetching premium products' });
  }
});

// Create new product (admin only)
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Product name is required and must be less than 200 characters'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description is required and must be less than 1000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('brand').trim().isLength({ min: 1 }).withMessage('Brand is required'),
  body('imageUrl').isURL().withMessage('Valid image URL is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productData = {
      ...req.body,
      inStock: req.body.stock > 0,
      images: req.body.images || [req.body.imageUrl],
      tags: req.body.tags || [],
      specifications: req.body.specifications || {},
      rating: 0,
      reviewCount: 0
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error creating product' });
  }
});

// Update product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update inStock based on stock
    if (req.body.stock !== undefined) {
      req.body.inStock = req.body.stock > 0;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error updating product' });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error deleting product' });
  }
});

// Update product stock (admin only)
router.patch('/:id/stock', adminAuth, [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quantity } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        stock: quantity,
        inStock: quantity > 0,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Product stock updated successfully',
      product
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Server error updating stock' });
  }
});

module.exports = router;