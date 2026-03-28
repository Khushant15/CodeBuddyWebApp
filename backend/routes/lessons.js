const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const { z } = require('zod');
const { getCachedData } = require('../utils/cache');

const querySchema = z.object({
  track: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

// @route   GET /api/lessons/counts
// @desc    Get counts of lessons grouped by track
router.get('/counts', async (req, res) => {
  console.log('HIT /api/lessons/counts');
  try {
    const cacheKey = 'lessons_counts_total';
    const counts = await getCachedData(cacheKey, async () => {
      const tracks = ['python', 'html', 'css', 'javascript', 'react', 'node', 'dsa'];
      const results = await Promise.all(tracks.map(async (t) => {
        const count = await Lesson.countDocuments({ track: t });
        return { [t]: count };
      }));
      return Object.assign({}, ...results);
    });
    res.json(counts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/lessons
// @desc    Get all lessons (optionally filter by track)
router.get('/', async (req, res) => {
  try {
    const validated = querySchema.safeParse(req.query);
    if (!validated.success) {
      return res.status(400).json({ error: validated.error.format() });
    }

    const { track, page, limit } = validated.data;
    const skip = (page - 1) * limit;

    // Case-insensitive track query
    const query = track ? { track: { $regex: new RegExp(`^${track}$`, 'i') } } : {};
    const cacheKey = `lessons_${track?.toLowerCase() || 'all'}_${page}_${limit}`;

    const result = await getCachedData(cacheKey, async () => {
      const [lessons, total] = await Promise.all([
        Lesson.find(query).sort({ order: 1 }).skip(skip).limit(limit),
        Lesson.countDocuments(query)
      ]);
      return {
        data: lessons,
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
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/lessons/:slug
// @desc    Get lesson by slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    
    // 1. Try direct slug match
    let lesson = await Lesson.findOne({ slug: idOrSlug });
    
    // 2. Try ID match (if it's a valid ObjectId)
    if (!lesson && mongoose.Types.ObjectId.isValid(idOrSlug)) {
      lesson = await Lesson.findById(idOrSlug);
    }
    
    // 3. Try Fallback: Slugify Title match (replaces - with space)
    if (!lesson) {
      const titleSearch = idOrSlug.replace(/-/g, ' ');
      lesson = await Lesson.findOne({ 
        title: { $regex: new RegExp(`^${titleSearch}$`, 'i') } 
      });
    }

    if (!lesson) {
      return res.status(404).json({ msg: 'Lesson node not found in current architecture' });
    }
    res.json(lesson);
  } catch (err) {
    console.error(`Lesson Fetch Error [${req.params.idOrSlug}]:`, err.message);
    res.status(500).send('Archival System Error');
  }
});

module.exports = router;
