const express = require('express');
const router = express.Router();
const axios = require('axios');

// Advanced AI Debug/Analysis
router.post('/debug', async (req, res) => {
  const { code, error, context } = req.body;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.json({ analysis: "Synthesis core offline. Please configure GROQ_API_KEY." });
  }

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: "You are the CodeBuddy Neural Architect. A user has encountered a logic or syntax failure in their code execution sandbox. Analyze the code and the specific error provided. provide a concise, high-fidelity explanation of WHY it failed and a HINT on how to solve it. Do NOT give the full solution code immediately. Use a professional, high-tech tone." 
        },
        { 
          role: "user", 
          content: `CONTEXT: ${context || 'Learning Session'}\nERROR: ${error}\nCODE:\n${code}` 
        }
      ]
    }, {
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
    });

    res.json({ analysis: response.data.choices[0].message.content });
  } catch (err) {
    console.error("AI Debug API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Neural link failed." });
  }
});

// General Chatbot for Doubts
router.post('/chat', async (req, res) => {
  const { message, history, context } = req.body;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.json({ response: "AI features are in demo mode. Please configure GROQ_API_KEY for real responses." });
  }

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are CodeBuddy, a helpful and high-tech coding tutor. Provide concise, accurate, and encouraging answers. Context: " + (context || "General coding") },
        ...(history || []),
        { role: "user", content: message }
      ]
    }, {
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
    });

    res.json({ response: response.data.choices[0].message.content });
  } catch (err) {
    console.error("AI Chat API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Architect core connection failure." });
  }
});

// Suggest Next Step
router.post('/suggest', async (req, res) => {
  const { progress } = req.body;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.json({ suggestion: "Continue your Python journey!" });
  }

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Based on the user's progress data, suggest ONE specific next learning step. Respond in JSON: { suggestion: string, reason: string }" },
        { role: "user", content: JSON.stringify(progress) }
      ],
      response_format: { type: "json_object" }
    }, {
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
    });

    res.json(JSON.parse(response.data.choices[0].message.content));
  } catch (err) {
    console.error("AI Suggest API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Architect suggestion engine failure." });
  }
});

module.exports = router;
