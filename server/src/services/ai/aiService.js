const env = require('../../config/env');
const logger = require('../../config/logger');
const MockAiProvider = require('./mockProvider');
const OllamaProvider = require('./ollamaProvider');
const GeminiProvider = require('./geminiProvider');

class AiService {
  constructor() {
    this.provider = this._resolveProvider(env.AI_PROVIDER);
  }

  _resolveProvider(providerName) {
    switch (providerName?.toLowerCase()) {
      case 'ollama':
        return new OllamaProvider(env.OLLAMA_BASE_URL, env.OLLAMA_MODEL);
      case 'gemini':
        return new GeminiProvider(env.GEMINI_API_KEY, env.GEMINI_MODEL);
      case 'mock':
      default:
        return new MockAiProvider();
    }
  }

  getProviderName() {
    return this.provider.name;
  }

  /**
   * Executes prompt against the configured AI provider with Zod validation and 1-time retry.
   */
  async executeWithValidation(prompt, schema, taskName = 'ai_task') {
    let lastError = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        logger.info(`Executing AI task: ${taskName} (attempt ${attempt}/2) using provider: ${this.provider.name}`);
        
        const rawJson = await this.provider.generateJson(prompt);
        const validated = schema.parse(rawJson);
        
        logger.info(`AI task succeeded and validated: ${taskName}`, {
          event: 'ai_task_success',
          taskName,
          attempt
        });

        return validated;
      } catch (error) {
        lastError = error;
        logger.warn(`AI task validation or generation failed on attempt ${attempt}: ${error.message}`, {
          event: 'ai_validation_failed',
          taskName,
          attempt,
          error: error.message
        });

        if (attempt === 1) {
          // Add a hint to the prompt for the retry
          prompt = `${prompt}\n\nIMPORTANT: Your previous attempt failed schema validation with error: ${error.message}. Please strictly follow the exact JSON format specified without any markdown fences.`;
        }
      }
    }

    logger.error(`AI task permanently failed after 2 attempts: ${taskName}`, {
      event: 'ai_request_failed',
      taskName,
      error: lastError.message
    });

    throw new Error(`AI processing failed for ${taskName}: ${lastError.message}`);
  }
}

// Singleton instance
const aiService = new AiService();

module.exports = aiService;
