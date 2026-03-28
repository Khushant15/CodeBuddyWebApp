const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { z } = require('zod');

// @route   GET /api/community/solutions/:lessonSlug
// @desc    Fetch peer solutions for a lesson
router.get('/solutions/:lessonSlug', async (req, res) => {
  try {
    const solutions = await UserProgress.find({ 
      lessonId: req.params.lessonSlug,
      'completedExercises.passed': true 
    })
    .sort({ lastAccessed: -1 })
    .limit(10)
    .lean();

    // Map to include pseudo-anonymized display names
    const enrichedSolutions = await Promise.all(solutions.map(async (s) => {
      const user = await User.findOne({ firebaseUID: s.userId }).select('displayName photoURL');
      return {
        _id: s._id,
        code: s.lastCode,
        author: user ? user.displayName : 'Architect Anonymous',
        authorPhoto: user ? user.photoURL : null,
        timestamp: s.lastAccessed
      };
    }));

    res.json(enrichedSolutions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const commentCreateSchema = z.object({
  firebaseUID: z.string().min(1),
  displayName: z.string().optional(),
  contextId: z.string().min(1),
  text: z.string().min(1).max(500),
  parentId: z.string().optional()
});

// @route   GET /api/community/:contextId
router.get('/:contextId', async (req, res) => {
  try {
    const comments = await Comment.find({ contextId: req.params.contextId }).sort({ createdAt: -1 }).limit(50);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/community/comment
router.post('/comment', async (req, res) => {
  try {
    const validated = commentCreateSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({ error: validated.error.format() });
    }

    const { firebaseUID, displayName, contextId, text, parentId } = validated.data;
    
    const comment = new Comment({
      firebaseUID,
      displayName,
      contextId,
      text,
      parentId: parentId || null
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PATCH /api/community/like/:id
router.patch('/like/:id', async (req, res) => {
  try {
    const { firebaseUID } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    if (comment.likes.includes(firebaseUID)) {
      comment.likes = comment.likes.filter(id => id !== firebaseUID);
    } else {
      comment.likes.push(firebaseUID);
    }

    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
