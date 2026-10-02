const axios = require('axios');
const env = require('../../config/env');
const logger = require('../../config/logger');

class GeminiProvider {
  constructor(apiKey = env.GEMINI_API_KEY, model = env.GEMINI_MODEL) {
    this.name = 'gemini';
    this.apiKey = apiKey;
    this.model = model || 'gemini-1.5-flash';
  }

  async generateJson(prompt, systemInstruction = '') {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables. Please supply a valid key or switch to AI_PROVIDER=ollama or AI_PROVIDER=mock.');
    }

    logger.info('Calling Gemini LLM provider', {
      event: 'ai_gemini_call',
      model: this.model
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    try {
      const response = await axios.post(url, requestBody, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      });

      const candidates = response.data?.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error('Gemini returned no candidates in response.');
      }

      const text = candidates[0].content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Gemini response part contains no text content.');
      }

      const cleanJsonStr = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
      const parsed = JSON.parse(cleanJsonStr);
      return parsed;
    } catch (error) {
      if (error.response?.data?.error) {
        const apiErr = error.response.data.error;
        logger.error('Gemini API returned error', {
          event: 'ai_request_failed',
          provider: 'gemini',
          status: error.response.status,
          message: apiErr.message
        });
        throw new Error(`Gemini API Error (${apiErr.code || error.response.status}): ${apiErr.message}`);
      }

      if (error instanceof SyntaxError) {
        logger.error('Failed to parse Gemini JSON response', {
          event: 'ai_validation_failed',
          rawResponse: error.message
        });
        throw new Error('Gemini generated invalid JSON: ' + error.message);
      }

      logger.error('Gemini request failed', {
        event: 'ai_request_failed',
        error: error.message
      });
      throw error;
    }
  }
}

module.exports = GeminiProvider;
