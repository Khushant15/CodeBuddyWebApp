const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  track: { type: String, required: true }, // e.g., 'python', 'html', 'css'
  chapter: { type: String, required: true },
  order: { type: Number, required: true },
  xpReward: { type: Number, default: 50 },
  
  // NEW: Structured Content
  theory: { type: String }, // Markdown supported
  examples: [{
    title: { type: String },
    code: { type: String },
    explanation: { type: String }
  }],
  exercises: [{
    problem: { type: String },
    starterCode: { type: String },
    lang: { type: String, default: 'python' },
    expectedOutput: { type: String },
    testCases: [{
      input: { type: String },
      expected: { type: String },
      isPublic: { type: Boolean, default: true }
    }],
    hints: [{ type: String }],
    solution: { type: String }
  }],
  
  // NEW: Metadata
  metadata: {
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Professional'], default: 'Beginner' },
    estimatedTime: { type: String }, // e.g., '15 mins'
    prerequisites: [{ type: String }],
    learningOutcomes: [{ type: String }]
  },

  locked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', LessonSchema);
