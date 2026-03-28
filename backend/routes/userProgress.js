const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/user-progress/:lessonId
// @desc    Get specific progress for a lesson (including last saved code)
router.get('/:lessonId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { lessonId } = req.params;
    console.log(`[USER_PROGRESS_TRACE] User: ${userId} | Module: ${lessonId}`);

    const progress = await UserProgress.findOne({ userId, lessonId });
    
    if (!progress) {
      return res.json({ status: 'not_started', lastCode: null });
    }

    res.json(progress);
  } catch (err) {
    console.error('Fetch UserProgress Error:', err.message);
    res.status(500).json({ error: 'FETCH_PROGRESS_FAILURE' });
  }
});

module.exports = router;
