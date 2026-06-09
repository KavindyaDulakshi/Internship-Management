const aiService = require('../services/aiService');
const AppError = require('../utils/appError');

/**
 * Generate a new set of interview questions
 */
const generateInterview = async (req, res, next) => {
  try {
    const { category, difficulty, skill } = req.body;

    if (!category || !difficulty || !skill) {
      return next(new AppError('Category, difficulty, and target skill/role are required parameters.', 400));
    }

    const result = await aiService.generateInterviewQuestions({ category, difficulty, skill });

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Grade a candidate's answer and get feedback
 */
const evaluateAnswer = async (req, res, next) => {
  try {
    const { question, answer } = req.body;

    if (!question || answer === undefined) {
      return next(new AppError('Question and candidate answer are required parameters.', 400));
    }

    const result = await aiService.evaluateInterviewAnswer({ question, answer });

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generate a custom quiz for a skill
 */
const generateQuiz = async (req, res, next) => {
  try {
    const { skill, difficulty } = req.body;

    if (!skill || !difficulty) {
      return next(new AppError('Skill name and difficulty level are required parameters.', 400));
    }

    const result = await aiService.generateQuiz({ skill, difficulty });

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateInterview,
  evaluateAnswer,
  generateQuiz
};
