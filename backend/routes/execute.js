const express = require('express');
const router = express.Router();
const { executeCode } = require('../utils/execution');
const { z } = require('zod');

// Schema for request validation
const executeSchema = z.object({
  code: z.string().min(1),
  language: z.enum(['python', 'javascript']).default('python'),
  stdin: z.string().optional().default("")
});

// @route   POST /api/execute
// @desc    Execute code via Judge0 kernel
router.post('/', async (req, res) => {
  try {
    const validated = executeSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({ error: validated.error.format() });
    }

    const { code, language, stdin } = validated.data;
    const result = await executeCode(code, language, stdin);

    res.json({
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      message: result.message,
      status: result.status,
      time: result.time,
      memory: result.memory
    });
  } catch (err) {
    console.error('Execution Route Error:', err.message);
    res.status(500).json({ error: 'CODE_EXECUTION_FAILURE', details: err.message });
  }
});

module.exports = router;
