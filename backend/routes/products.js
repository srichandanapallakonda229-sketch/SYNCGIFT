const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. x-user-id header is missing' });
  }
  const user = await db.getUserById(userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
};

// GET products with search, filters, and sort
router.get('/', async (req, res) => {
  try {
    let products = await db.getProducts();
    const { search, category, minPrice, maxPrice, rating, sortBy } = req.query;

    // Search query matching
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    // Category strict matching
    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Price range filters
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Rating filter
    if (rating) {
      products = products.filter(p => p.rating >= parseFloat(rating));
    }

    // Sort options
    if (sortBy) {
      if (sortBy === 'price-asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'popularity') {
        // Sort by review count
        products.sort((a, b) => (b.reviews ? b.reviews.length : 0) - (a.reviews ? a.reviews.length : 0));
      } else if (sortBy === 'latest') {
        // Sort by id / age
        products.reverse();
      }
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Fetch products error:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product details
router.get('/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Fetch product error:', error.message);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// POST new product (Admin only)
router.post('/', isAdmin, async (req, res) => {
  const { name, category, description, price, quantity, imageUrl } = req.body;
  if (!name || !category || !description || price === undefined || quantity === undefined || !imageUrl) {
    return res.status(400).json({ error: 'Missing required product parameters' });
  }

  try {
    const newProduct = await db.createProduct({
      name,
      category,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imageUrl
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create product error:', error.message);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product (Admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const updated = await db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error('Update product error:', error.message);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const success = await db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// POST product review
router.post('/:id/review', async (req, res) => {
  const { user, rating, comment } = req.body;
  if (!user || !rating) {
    return res.status(400).json({ error: 'Missing user name or rating score' });
  }

  try {
    const updatedProduct = await db.addProductReview(req.params.id, {
      user,
      rating: parseInt(rating),
      comment: comment || ''
    });
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Add review error:', error.message);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;
