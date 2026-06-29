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

// GET shop info
router.get('/', async (req, res) => {
  try {
    const info = await db.getShopInfo();
    res.status(200).json(info);
  } catch (error) {
    console.error('Fetch shop info error:', error.message);
    res.status(500).json({ error: 'Failed to fetch shop details' });
  }
});

// PUT update shop info (Admin only)
router.put('/', isAdmin, async (req, res) => {
  try {
    const updated = await db.updateShopInfo(req.body);
    res.status(200).json(updated);
  } catch (error) {
    console.error('Update shop info error:', error.message);
    res.status(500).json({ error: 'Failed to update shop details' });
  }
});

module.exports = router;
