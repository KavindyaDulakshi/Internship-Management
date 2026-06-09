const express = require('express');
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All AI generation and grading routes require authentication
router.post('/interview/generate', protect, aiController.generateInterview);
router.post('/interview/evaluate', protect, aiController.evaluateAnswer);
router.post('/quiz/generate', protect, aiController.generateQuiz);

module.exports = router;
