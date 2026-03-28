const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const { z } = require('zod');

const eventSchema = z.object({
  firebaseUID: z.string().min(1),
  eventType: z.string().min(1),
  itemId: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

// @route   POST /api/analytics/track
router.post('/track', async (req, res) => {
  try {
    const validated = eventSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({ error: validated.error.format() });
    }

    const { firebaseUID, eventType, itemId, metadata } = validated.data;
    
    const event = new Analytics({
      firebaseUID,
      eventType,
      itemId,
      metadata
    });

    await event.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Analytics Save Error:", err);
    res.status(500).json({ error: "Data integrity sync failure." });
  }
});

// @route   GET /api/analytics/summary/:firebaseUID
router.get('/summary/:firebaseUID', async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    const completedLessonsCount = await Analytics.countDocuments({ firebaseUID, eventType: 'lesson_complete' });
    const totalEvents = await Analytics.countDocuments({ firebaseUID });
    
    res.json({
      lessonsCompleted: completedLessonsCount,
      totalInteractions: totalEvents
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
