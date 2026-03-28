const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true },
  displayName: { type: String, default: 'Developer' },
  contextId: { type: String, required: true }, // lesson slug or problem id
  text: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  likes: [{ type: String }], // array of firebaseUIDs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
