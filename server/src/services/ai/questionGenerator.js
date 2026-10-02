const aiService = require('./aiService');
const { buildQuestionGenerationPrompt } = require('./prompts/questionGenerationPrompt');
const { QuestionGenerationResultSchema } = require('../../validators/aiValidators');
const logger = require('../../config/logger');

async function generateClarificationQuestions(issues) {
  if (!issues || issues.length === 0) {
    return { questions: [] };
  }

  logger.info('Generating clarification questions for identified gaps', {
    event: 'question_generation_started',
    issueCount: issues.length
  });

  const prompt = buildQuestionGenerationPrompt(issues);

  const result = await aiService.executeWithValidation(
    prompt,
    QuestionGenerationResultSchema,
    'question_generation'
  );

  logger.info('Clarification questions generated', {
    event: 'questions_generated',
    questionCount: result.questions.length
  });

  return result;
}

module.exports = { generateClarificationQuestions };
