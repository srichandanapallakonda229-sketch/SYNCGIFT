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

// GET all orders (Admin only)
router.get('/', isAdmin, async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET order history for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await db.getOrdersByUserId(req.params.userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Fetch user orders error:', error.message);
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

// POST submit a new order
router.post('/', async (req, res) => {
  const { userId, products, totalAmount, shippingAddress, contactPhone } = req.body;
  if (!userId || !products || !products.length || !totalAmount) {
    return res.status(400).json({ error: 'Missing required order details' });
  }

  try {
    // Check if products exist and have enough quantity
    let allProducts = await db.getProducts();
    for (const item of products) {
      const dbProd = allProducts.find(p => p.id === item.productId);
      if (!dbProd) {
        return res.status(404).json({ error: `Product not found: ${item.name}` });
      }
      if (dbProd.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product: ${item.name}. Available: ${dbProd.quantity}` });
      }
    }

    const order = await db.createOrder({
      userId,
      products,
      totalAmount: parseFloat(totalAmount),
      shippingAddress: shippingAddress || '',
      contactPhone: contactPhone || ''
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Submit order error:', error.message);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// PUT update order status (Admin only)
router.put('/:id/status', isAdmin, async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Missing status update' });
  }

  try {
    const order = await db.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Update order status error:', error.message);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
