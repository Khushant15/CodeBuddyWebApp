const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Progress = require('../models/Progress');
const { z } = require('zod');

const syncSchema = z.object({
  firebaseUID: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().optional()
});

// @route   POST /api/auth/sync
// @desc    Sync Firebase User with MongoDB and initialize Progress
router.post('/sync', async (req, res) => {
  const validated = syncSchema.safeParse(req.body);
  if (!validated.success) {
    return res.status(400).json({ error: validated.error.format() });
  }

  const { firebaseUID, email, displayName } = validated.data;

  try {
    let user = await User.findOne({ firebaseUID });

    if (!user) {
      // Create new user
      user = new User({
        firebaseUID,
        email,
        displayName: displayName || 'Developer'
      });
      await user.save();
    } else {
      // Update existing user
      user.displayName = displayName || user.displayName;
      user.email = email;
      user.updatedAt = Date.now();
      await user.save();
    }

    // Initialize or fetch Progress
    let progress = await Progress.findOne({ firebaseUID });
    if (!progress) {
      progress = new Progress({
        userId: user._id,
        firebaseUID,
        completedLessons: [],
        solvedProblems: [],
        testScores: {},
        currentLevel: {},
        xp: 0,
        streak: 0
      });
      await progress.save();
    }

    res.json({ user, progress });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
