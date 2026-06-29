const express = require('express');
const router = express.Router();
const db = require('../db');

// Login / Register route
router.post('/login', async (req, res) => {
  const { id, name, email, imageUrl } = req.body;
  if (!id || !name || !email) {
    return res.status(400).json({ error: 'Missing required user fields' });
  }

  try {
    // umasgifty01@gmail.com is the sole admin account
    const ADMIN_EMAIL = 'umasgifty01@gmail.com';
    const user = await db.upsertUser({ id, name, email, imageUrl });
    
    // Auto-assign admin role if email matches
    if (email === ADMIN_EMAIL && user.role !== 'admin') {
      await db.updateUserRole(user.id, 'admin');
      user.role = 'admin';
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

// Update user role (Admin only - typically done by existing admin)
router.put('/role', async (req, res) => {
  const { id, role } = req.body;
  if (!id || !role) {
    return res.status(400).json({ error: 'Missing user ID or role' });
  }

  try {
    const user = await db.updateUserRole(id, role);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Update role error:', error.message);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

module.exports = router;
