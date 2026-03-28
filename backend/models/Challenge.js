const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Professional'], default: 'Beginner' },
  topic: { type: String, required: true },
  lang: { type: String, required: true },
  judge0Id: { type: Number },
  time: { type: Number }, // in seconds
  xpReward: { type: Number, default: 50 },
  desc: { type: String },
  buggyCode: { type: String },
  hints: [{ type: String }],
  solution: { type: String },
  explanation: { type: String },
  testCases: [{
    input: String,
    expected: String
  }],
  locked: { type: Boolean, default: false }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
