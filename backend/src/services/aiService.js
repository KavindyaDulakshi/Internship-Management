const AppError = require('../utils/appError');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const FALLBACK_MODELS = [
  'liquid/lfm-2.5-1.2b-instruct:free',
  'openai/gpt-oss-120b:free',
  'nvidia/nemotron-nano-9b-v2:free',
  'openrouter/free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'qwen/qwen3-coder:free',
  'google/gemma-4-31b-it:free',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition:free'
];

/**
 * Helper to call OpenRouter API with fallbacks
 */
const callOpenRouter = async (messages) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new AppError('OpenRouter API key is not configured in the backend environment.', 500);
  }

  let lastError = null;

  for (const model of FALLBACK_MODELS) {
    try {
      console.log(`Attempting AI generation with model: ${model}`);
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://internhub.dev', // Required by OpenRouter
          'X-Title': 'InternHub Career Platform'
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        console.warn(`Model ${model} failed with status ${response.status}:`, errBody?.error?.message);
        lastError = new AppError(errBody?.error?.message || `API error: ${response.status}`, response.status);
        await new Promise(resolve => setTimeout(resolve, 500)); // sleep to prevent rapid hits
        continue; // Try next model
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        console.warn(`Model ${model} returned empty content.`);
        lastError = new AppError('Empty response from AI engine.', 500);
        await new Promise(resolve => setTimeout(resolve, 500));
        continue; // Try next model
      }

      try {
        const parsed = JSON.parse(content);
        console.log(`Success with model: ${model}`);
        return parsed;
      } catch (jsonErr) {
        console.warn(`Model ${model} output is not valid JSON, retrying. Content:`, content);
        lastError = new AppError('AI returned invalid JSON formatting.', 500);
        await new Promise(resolve => setTimeout(resolve, 500));
        continue; // Try next model
      }
    } catch (err) {
      console.error(`Fetch exception for model ${model}:`, err.message);
      lastError = err;
      await new Promise(resolve => setTimeout(resolve, 500));
      // Try next model
    }
  }

  throw lastError || new AppError('Failed to process AI request using all available free endpoints.', 500);
};

/**
 * Generate mock interview questions
 */
const generateInterviewQuestions = async ({ category, difficulty, skill }) => {
  const systemPrompt = `You are an expert technical interviewer and recruiter. 
Generate exactly 3 realistic interview questions for a candidate.
Category: ${category}
Difficulty: ${difficulty}
Target Skill/Role: ${skill}

Return a JSON object in the following format:
{
  "questions": [
    {
      "id": "q1",
      "category": "${category}",
      "difficulty": "${difficulty}",
      "question": "Realistic, high-quality question content...",
      "timeLimit": 120,
      "tips": ["Constructive tip 1", "Constructive tip 2", "Constructive tip 3"],
      "sampleAnswer": "Detailed, professional sample answer that demonstrates mastery."
    }
  ]
}
Return ONLY a valid JSON object. No markdown, no enclosing tags, no extra characters. Make sure "questions" has exactly 3 elements.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Generate 3 ${difficulty} ${category} questions for a student learning ${skill}.` }
  ];

  return callOpenRouter(messages);
};

/**
 * Evaluate a mock interview answer
 */
const evaluateInterviewAnswer = async ({ question, answer }) => {
  const systemPrompt = `You are an AI interviewer grading a candidate's response.
Compare the candidate's answer against the interview question and determine an appropriate score and feedback.

Return a JSON object in the following format:
{
  "aiScore": 85, 
  "aiFeedback": "Constructive feedback detailing what was good, what was missing, and actionable tips to improve.",
  "sampleAnswer": "A strong, professional, exemplary answer to the question."
}
Return ONLY a valid JSON object. No markdown, no enclosing tags, no extra characters.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Question: "${question}"\nCandidate's Answer: "${answer}"` }
  ];

  return callOpenRouter(messages);
};

/**
 * Generate a skill assessment quiz
 */
const generateQuiz = async ({ skill, difficulty }) => {
  const systemPrompt = `You are a computer science instructor compiling a skill assessment test.
Generate exactly 5 multiple choice questions about: ${skill} (Difficulty: ${difficulty}).

Return a JSON object in the following format:
{
  "questions": [
    {
      "id": "q1",
      "question": "The question content...",
      "options": ["Option A content", "Option B content", "Option C content", "Option D content"],
      "correctAnswer": "A",
      "explanation": "Detailed explanation of why the correct option is right and the others are incorrect."
    }
  ]
}
Important:
- "options" must contain exactly 4 options.
- "correctAnswer" must be one of: "A", "B", "C", "D" (matching options indices 0, 1, 2, 3).
- Return ONLY a valid JSON object. No markdown, no enclosing tags, no extra characters. Make sure "questions" has exactly 5 elements.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Generate a 5-question ${difficulty} quiz on ${skill}.` }
  ];

  return callOpenRouter(messages);
};

module.exports = {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateQuiz
};
