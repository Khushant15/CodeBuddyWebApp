const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const axios = require('axios');
const { z } = require('zod');
const { getCachedData } = require('../utils/cache');

const querySchema = z.object({
  topic: z.string().optional(),
  difficulty: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

// GET all problems with filters
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
    
    const cacheKey = `practice_${topic || 'all'}_${difficulty || 'all'}_${page}_${limit}`;

    const result = await getCachedData(cacheKey, async () => {
      const [problems, total] = await Promise.all([
        Challenge.find(query).sort({ xpReward: 1 }).skip(skip).limit(limit),
        Challenge.countDocuments(query)
      ]);
      return {
        data: problems,
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

// GET one problem
router.get('/:id', async (req, res) => {
  try {
    const problem = await Challenge.findById(req.params.id);
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Execute code via Judge0 proxy
router.post('/execute', async (req, res) => {
  const { source_code, language_id, stdin, expected_output } = req.body;
  const JUDGE0_KEY = process.env.JUDGE0_KEY;

  if (!JUDGE0_KEY) {
    // Fallback for demo: return expected output if provided, otherwise success
    const output = expected_output ? `Correct Output: ${expected_output}\n(Demo Mode: Accepted)` : "Output: Success\n(Please configure JUDGE0_KEY in backend/.env for real execution)";
    return res.json({ status: { description: "Accepted (Demo Mode)" }, stdout: btoa(output) });
  }

  try {
    const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true', {
      source_code: btoa(source_code),
      language_id,
      stdin: btoa(stdin || "")
    }, {
      headers: {
        'X-RapidAPI-Key': JUDGE0_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
