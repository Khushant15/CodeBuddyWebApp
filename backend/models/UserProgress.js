const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Firebase UID
  lessonId: { type: String, required: true }, // Slug or _id
  lastCode: { type: String },
  status: { type: String, enum: ['started', 'completed'], default: 'started' },
  score: { type: Number, default: 0 },
  completedExercises: [{ 
    exerciseIndex: { type: Number },
    code: { type: String },
    passed: { type: Boolean, default: false }
  }],
  currentExerciseIndex: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now }
});

// Ensure a user has only one progress record per lesson
UserProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);
