const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const { z } = require('zod');
const { getCachedData } = require('../utils/cache');

const querySchema = z.object({
  topic: z.string().optional(),
  difficulty: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

// GET all tests
router.get('/', async (req, res) => {
  try {
    const validated = querySchema.safeParse(req.query);
    if (!validated.success) {
      return res.status(400).json({ error: validated.error.format() });
    }

    const { topic, difficulty, page, limit } = validated.data;
    const skip = (page - 1) * limit;

    let query = {};
    if (topic && topic !== 'all') query.topic = topic;
    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
    
    const cacheKey = `tests_${topic || 'all'}_${difficulty || 'all'}_${page}_${limit}`;

    const result = await getCachedData(cacheKey, async () => {
      const [tests, total] = await Promise.all([
        Test.find(query).skip(skip).limit(limit),
        Test.countDocuments(query)
      ]);
      return {
        data: tests,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one test by slug
router.get('/:slug', async (req, res) => {
  try {
    const test = await Test.findOne({ slug: req.params.slug });
    if (!test) return res.status(404).json({ msg: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
