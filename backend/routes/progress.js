const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const User = require('../models/User');
const ROADMAP_STRUCTURE = require('../config/roadmap');
const { triggerNotification } = require('../utils/notify');

// Helper to update streaks and badges
const updateEngagement = async (progress) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  if (progress.lastActiveDate === yesterday) {
    progress.streak += 1;
    triggerNotification(progress.firebaseUID, 'Streak Maintained!', `You've reached a ${progress.streak} day streak! Keep it up.`, 'streak');
  } else if (progress.lastActiveDate !== today) {
    progress.streak = 1;
  }
  progress.lastActiveDate = today;

  // Badge logic (example)
  if (progress.streak >= 7 && !progress.badges.includes('7-Day Streak')) {
    progress.badges.push('7-Day Streak');
    triggerNotification(progress.firebaseUID, 'New Badge: Week Warrior', 'You achieved a 7-day streak! Check your profile.', 'streak');
  }
  if (progress.xp >= 1000 && !progress.badges.includes('1K XP Milestone')) {
    progress.badges.push('1K XP Milestone');
  }
};

// @route   GET /api/progress/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const global = await Progress.find().sort({ xp: -1 }).limit(10).populate('userId', 'displayName photoURL');
    const weekly = await Progress.find().sort({ weeklyXP: -1 }).limit(10).populate('userId', 'displayName photoURL');
    res.json({ global, weekly });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/progress/:firebaseUID
router.get('/:firebaseUID', async (req, res) => {
  try {
    let progress = await Progress.findOne({ firebaseUID: req.params.firebaseUID });
    if (!progress) return res.status(404).json({ msg: 'Progress not found' });
    
    // Update streak on fetch to ensure dashboard is accurate
    await updateEngagement(progress);
    await progress.save();

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PATCH /api/progress/complete
router.patch('/complete', async (req, res) => {
  const { firebaseUID, itemId, itemType, xpReward } = req.body;
  try {
    let progress = await Progress.findOne({ firebaseUID });
    if (!progress) return res.status(404).json({ msg: 'Progress not found' });

    let alreadyDone = false;
    if (itemType === 'lesson') {
      if (!progress.completedLessons.includes(itemId)) progress.completedLessons.push(itemId);
      else alreadyDone = true;
    } else if (itemType === 'problem') {
       if (!progress.solvedProblems.includes(itemId)) progress.solvedProblems.push(itemId);
       else alreadyDone = true;
    }

    if (!alreadyDone) {
      if (xpReward) {
        progress.xp += xpReward;
        progress.weeklyXP += xpReward;
      }
      const topic = itemId.toString().split('-')[0];
      const roadmapTopic = ROADMAP_STRUCTURE.find(t => t.topic === topic);
      if (roadmapTopic) {
        const currentLevelNum = progress.currentLevel.get(topic) || 1;
        const currentLevelIdx = currentLevelNum - 1;
        if (currentLevelIdx < roadmapTopic.levels.length) {
          const nodes = roadmapTopic.levels[currentLevelIdx].nodes;
          if (nodes.every(n => progress.completedLessons.includes(n) || progress.solvedProblems.includes(n))) {
            if (currentLevelNum < roadmapTopic.levels.length) progress.currentLevel.set(topic, currentLevelNum + 1);
          }
        }
      }
      await updateEngagement(progress);
      await progress.save();
      triggerNotification(progress.firebaseUID, `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Complete!`, `You've earned ${xpReward} XP for completing ${itemId}.`, 'progress');
    }
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/progress/test
router.post('/test', async (req, res) => {
  const { firebaseUID, testSlug, score, xpReward } = req.body;
  try {
    const progress = await Progress.findOne({ firebaseUID });
    if (!progress) return res.status(404).json({ msg: 'Progress not found' });

    progress.testScores.set(testSlug, score);
    if (score >= 70 && xpReward) {
      progress.xp += xpReward;
      progress.weeklyXP += xpReward;
    }
    
    await updateEngagement(progress);
    await progress.save();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
