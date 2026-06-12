/**
 * API 路由 — /api/brainstorm 和 /api/merge
 */
const express = require('express');
const router = express.Router();
const llmService = require('../services/llmService');

// POST /api/brainstorm
router.post('/brainstorm', async (req, res) => {
  const { word } = req.body;
  if (!word || typeof word !== 'string' || word.trim().length === 0) {
    return res.status(400).json({ error: '请提供有效的词语' });
  }

  try {
    const results = await llmService.brainstormWord(word.trim());
    res.json({ results });
  } catch (err) {
    console.error('brainstorm error:', err.message);
    res.status(500).json({ error: err.message || 'AI 服务出错，请稍后重试' });
  }
});

// POST /api/merge
router.post('/merge', async (req, res) => {
  const { words } = req.body;
  if (!words || !Array.isArray(words) || words.length < 2) {
    return res.status(400).json({ error: '请至少选择2个词语' });
  }

  try {
    const result = await llmService.mergeWords(words);
    res.json(result);
  } catch (err) {
    console.error('merge error:', err.message);
    res.status(500).json({ error: err.message || 'AI 服务出错，请稍后重试' });
  }
});

module.exports = router;
