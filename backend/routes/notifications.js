const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { z } = require('zod');

// @route   GET /api/notifications/:firebaseUID
router.get('/:firebaseUID', async (req, res) => {
  try {
    const notifications = await Notification.find({ firebaseUID: req.params.firebaseUID }).sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PATCH /api/notifications/read/:id
router.patch('/read/:id', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
