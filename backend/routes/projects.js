const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const UserProject = require('../models/UserProject');
const { auth } = require('../config/firebase');
const authMiddleware = require('../middleware/auth');

// GET all projects with filters
router.get('/', async (req, res) => {
  try {
    const { difficulty, tech } = req.query;
    let query = {};
    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
    if (tech && tech !== 'all') query.techStack = tech;

    const projects = await Project.find(query).select('-steps.solution');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single project with user progress
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    let userProgress = await UserProject.findOne({ 
      userId: req.user.uid, 
      projectId: req.params.id 
    });

    res.json({ project, userProgress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// START or RESUME project
router.post('/:id/start', authMiddleware, async (req, res) => {
  try {
    let userProgress = await UserProject.findOne({ 
      userId: req.user.uid, 
      projectId: req.params.id 
    });

    if (!userProgress) {
      userProgress = new UserProject({
        userId: req.user.uid,
        projectId: req.params.id,
        currentStep: 0,
        checkpoints: new Map()
      });
      await userProgress.save();
    }

    res.json(userProgress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SAVE step progress and code
router.post('/:id/step', authMiddleware, async (req, res) => {
  try {
    const { stepIndex, code, isCompleted } = req.body;
    let userProgress = await UserProject.findOne({ 
      userId: req.user.uid, 
      projectId: req.params.id 
    });

    if (!userProgress) return res.status(404).json({ error: 'Progress not found' });

    userProgress.checkpoints.set(stepIndex.toString(), code);
    
    if (isCompleted) {
      userProgress.currentStep = Math.max(userProgress.currentStep, stepIndex + 1);
      
      const project = await Project.findById(req.params.id);
      if (userProgress.currentStep >= project.steps.length) {
        userProgress.isCompleted = true;
        userProgress.completedAt = Date.now();
      }
    }

    await userProgress.save();
    res.json(userProgress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
