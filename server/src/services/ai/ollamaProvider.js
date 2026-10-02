const axios = require('axios');
const env = require('../../config/env');
const logger = require('../../config/logger');

class OllamaProvider {
  constructor(baseUrl = env.OLLAMA_BASE_URL, model = env.OLLAMA_MODEL) {
    this.name = 'ollama';
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.model = model;
  }

  async generateJson(prompt, systemInstruction = '') {
    logger.info('Calling Ollama LLM provider', {
      event: 'ai_ollama_call',
      baseUrl: this.baseUrl,
      model: this.model
    });

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/generate`,
        {
          model: this.model,
          prompt: prompt,
          system: systemInstruction || 'You are an expert JSON-only grant completeness assistant. Always output strictly valid JSON.',
          format: 'json',
          stream: false,
          options: {
            temperature: 0.1
          }
        },
        {
          timeout: 120000 // 2 minutes timeout for local inference
        }
      );

      if (!response.data || !response.data.response) {
        throw new Error('Ollama returned an empty response.');
      }

      const responseText = response.data.response.trim();
      const parsed = JSON.parse(responseText);
      return parsed;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        logger.error('Ollama connection refused. Is Ollama running on ' + this.baseUrl + '?', {
          event: 'ai_request_failed',
          provider: 'ollama'
        });
        throw new Error(`Ollama is not reachable at ${this.baseUrl}. Please make sure Ollama is running ('ollama serve') or set AI_PROVIDER=mock or AI_PROVIDER=gemini.`);
      }

      if (error instanceof SyntaxError) {
        logger.error('Failed to parse Ollama JSON response', {
          event: 'ai_validation_failed',
          rawResponse: error.message
        });
        throw new Error('Ollama generated invalid JSON: ' + error.message);
      }

      logger.error('Ollama request failed', {
        event: 'ai_request_failed',
        error: error.message
      });
      throw error;
    }
  }
}

module.exports = OllamaProvider;
