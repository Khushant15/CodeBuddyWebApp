const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  firebaseUID: { type: String, required: true, unique: true },
  completedLessons: [{ type: String }], // Array of lesson slugs/IDs
  solvedProblems: [{ type: String }],   // Array of challenge/problem IDs
  testScores: {
    type: Map,
    of: Number // e.g. { "python-final": 85, "html-midterm": 90 }
  },
  currentLevel: {
    type: Map,
    of: Number, // e.g. { "python": 1, "webdev": 1 }
    default: {
      "html": 1, "css": 1, "javascript": 1, "react": 1, "node": 1, "dsa": 1, "python": 1
    }
  },
  roadmapProgress: {
    type: Map, 
    of: Object // e.g. { "python-beginner": "Completed", "python-intermediate": "In Progress" }
  },
  xp: { type: Number, default: 0 },
  weeklyXP: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  badges: [{ type: String }], // e.g. ["Python Beginner", "7-Day Streak"]
  lastActiveDate: { type: String, default: new Date().toISOString().split('T')[0] },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', ProgressSchema);
