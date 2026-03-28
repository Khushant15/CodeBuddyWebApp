const mongoose = require('mongoose');

const ProjectStepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  explanation: { type: String, required: true },
  initialCode: { type: String, default: '' },
  solution: { type: String },
  commonMistakes: [String],
  hints: [String],
  expectedOutput: { type: String }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  techStack: [String],
  estimatedTime: { type: String },
  xpReward: { type: Number, default: 200 },
  learningOutcomes: [String],
  prerequisites: [String],
  demoUrl: { type: String },
  steps: [ProjectStepSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
