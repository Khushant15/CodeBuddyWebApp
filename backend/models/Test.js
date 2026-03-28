const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Professional'], default: 'Beginner' },
  duration: { type: Number, default: 600 }, // in seconds
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    points: { type: Number, default: 10 }
  }],
  passingScore: { type: Number, default: 70 }, // percentage
  xpReward: { type: Number, default: 100 }
});

module.exports = mongoose.model('Test', TestSchema);
