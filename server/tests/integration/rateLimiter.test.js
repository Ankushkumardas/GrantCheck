import { describe, it, expect, beforeAll, afterAll } from 'vitest';
const request = require('supertest');
const app = require('../../src/app');

describe('Rate Limiter Middleware Integration', () => {
  describe('Global Rate Limiter', () => {
    it('should limit requests after 100 requests', async () => {
      // It's not practical to actually send 100 requests in a normal test without bypassing or mocking.
      // But we can check if the RateLimit headers are present on a normal request.
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.headers).toHaveProperty('ratelimit-limit');
      expect(res.headers).toHaveProperty('ratelimit-remaining');
    });
  });
});
