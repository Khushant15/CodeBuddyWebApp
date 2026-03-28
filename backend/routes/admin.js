const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Challenge = require('../models/Challenge');
const Test = require('../models/Test');
const User = require('../models/User');

// GET Stats for Admin Dashboard
router.get('/stats', async (req, res) => {
  try {
    const [userCount, lessonCount, challengeCount] = await Promise.all([
      User.countDocuments(),
      Lesson.countDocuments(),
      Challenge.countDocuments()
    ]);
    res.json({ users: userCount, lessons: lessonCount, problems: challengeCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD for Lessons, Practice, etc. would go here...
// For now, I'll include just the stats and a list of users.
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(50);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
