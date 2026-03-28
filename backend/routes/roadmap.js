const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const ROADMAP_STRUCTURE = require('../config/roadmap');

// GET roadmap progress for a user
router.get('/:firebaseUID', async (req, res) => {
  try {
    const progress = await Progress.findOne({ firebaseUID: req.params.firebaseUID });
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    const dynamicRoadmap = ROADMAP_STRUCTURE.map(topic => {
      const userLevel = progress.currentLevel.get(topic.topic) || 1;
      
      return {
        ...topic,
        levels: topic.levels.map((lvl, index) => {
          const levelNum = index + 1;
          const isLocked = levelNum > userLevel;
          
          return {
            ...lvl,
            status: isLocked ? 'Locked' : (levelNum === userLevel ? 'In Progress' : 'Completed'),
            nodes: lvl.nodes.map(nodeId => {
               const nodeStatus = progress.roadmapProgress?.get(nodeId) || (progress.completedLessons.includes(nodeId) ? 'Completed' : 'Not Started');
               return { id: nodeId, status: nodeStatus };
            })
          };
        })
      };
    });

    res.json(dynamicRoadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/update-node', async (req, res) => {
  const { firebaseUID, nodeId, status } = req.body;
  try {
    const progress = await Progress.findOne({ firebaseUID });
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    if (!progress.roadmapProgress) progress.roadmapProgress = new Map();
    progress.roadmapProgress.set(nodeId, status);
    
    await progress.save();
    res.json({ success: true, roadmapProgress: progress.roadmapProgress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
