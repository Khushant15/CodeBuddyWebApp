const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const UserProgress = require('../models/UserProgress');
const { executeCode } = require('../utils/execution');
const { runTestCases } = require('../utils/validation');
const { z } = require('zod');

const validateReqSchema = z.object({
  lessonSlug: z.string(),
  exerciseIndex: z.number().int().min(0).default(0),
  code: z.string().min(1),
  language: z.enum(['python', 'javascript']).default('python'),
  userId: z.string().optional() // From auth middleware if present
});

// @route   POST /api/validate
// @desc    Submit exercise for validation and update progress
router.post('/', async (req, res) => {
  try {
    const validated = validateReqSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({ error: validated.error.format() });
    }

    const { lessonSlug, exerciseIndex, code, language } = validated.data;
    const userId = req.user ? req.user.uid : req.body.userId; // Support both auth middleware and direct passing for testing
    
    if (!userId) {
      return res.status(401).json({ error: 'AUTHENTICATION_REQUIRED' });
    }

    const lesson = await Lesson.findOne({ slug: lessonSlug });
    if (!lesson) {
      return res.status(404).json({ error: 'LESSON_NOT_FOUND' });
    }

    const exercise = lesson.exercises[exerciseIndex];
    if (!exercise) {
      return res.status(400).json({ error: 'EXERCISE_NOT_FOUND' });
    }

    // Run Validation Kernel
    const { allPassed, results } = await runTestCases(
      executeCode, 
      code, 
      language, 
      exercise.testCases
    );

    // Update Progress System
    let progress = await UserProgress.findOne({ userId, lessonId: lessonSlug });
    
    if (!progress) {
      progress = new UserProgress({ userId, lessonId: lessonSlug });
    }

    progress.lastCode = code;
    
    // Update completed exercises
    const existingIndex = progress.completedExercises.findIndex(ex => ex.exerciseIndex === exerciseIndex);
    if (existingIndex > -1) {
      progress.completedExercises[existingIndex].code = code;
      progress.completedExercises[existingIndex].passed = allPassed;
    } else {
      progress.completedExercises.push({ exerciseIndex, code, passed: allPassed });
    }

    // Advance currentExerciseIndex if this was the current challenge
    if (allPassed && exerciseIndex === progress.currentExerciseIndex) {
      if (exerciseIndex < lesson.exercises.length - 1) {
        progress.currentExerciseIndex = exerciseIndex + 1;
      }
    }

    // Synchronize with GLOBAL Progress System
    if (progress.status === 'completed') {
      const Progress = require('../models/Progress');
      let globalProgress = await Progress.findOne({ firebaseUID: userId });
      
      if (globalProgress) {
        if (!globalProgress.completedLessons.includes(lessonSlug)) {
          globalProgress.completedLessons.push(lessonSlug);
          globalProgress.xp += (lesson.xpReward || 100);
          globalProgress.weeklyXP += (lesson.xpReward || 100);
          globalProgress.updatedAt = Date.now();
          await globalProgress.save();
        }
      }
    }

    await progress.save();

    res.json({
      allPassed,
      testCaseResults: results,
      totalXP: progress.score,
      status: progress.status
    });

  } catch (err) {
    console.error('Validation Route Error:', err.message);
    res.status(500).json({ error: 'SYSTEM_VALIDATION_FAILURE', details: err.message });
  }
});

module.exports = router;
