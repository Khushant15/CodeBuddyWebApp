const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true },
  eventType: { type: String, required: true }, // 'lesson_start', 'lesson_complete', 'practice_start', 'session_heartbeat'
  itemId: { type: String }, // lesson slug or problem id
  metadata: { type: mongoose.Schema.Types.Mixed }, // timeSpent, browser, etc.
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
