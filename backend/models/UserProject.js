const mongoose = require('mongoose');

const UserProjectSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Firebase UID
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  currentStep: { type: Number, default: 0 },
  checkpoints: { type: Map, of: String }, // Step index -> User Code
  isCompleted: { type: Boolean, default: false },
  bookmarked: { type: Boolean, default: false },
  lastStarted: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

UserProjectSchema.index({ userId: 1, projectId: 1 }, { unique: true });

module.exports = mongoose.model('UserProject', UserProjectSchema);
