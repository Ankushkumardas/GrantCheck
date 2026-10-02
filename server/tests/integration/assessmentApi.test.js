import { describe, it, expect, beforeAll, afterAll } from 'vitest';
const request = require('supertest');
const path = require('path');
const app = require('../../src/app');
const { connectDB, disconnectDB } = require('../../src/config/db');

describe('Full Assessment API Integration Test', () => {
  let authToken = '';
  let assessmentId = '';
  let mappingId = '';

  beforeAll(async () => {
    process.env.AI_PROVIDER = 'mock';
    await connectDB();
  }, 60000);

  afterAll(async () => {
    await disconnectDB();
  });

  it('POST /api/auth/login should authenticate demo user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@example.com', password: 'demo123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    authToken = res.body.token;
  });

  it('POST /api/assessments should create a new assessment draft', async () => {
    const res = await request(app)
      .post('/api/assessments')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Community Action Grant 2026 Test' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.assessment._id).toBeDefined();
    assessmentId = res.body.assessment._id;
  });

  it('POST /api/assessments/:id/guideline should upload and extract guideline PDF', async () => {
    const sampleGuideline = path.resolve(__dirname, '../../../sample-documents/guidelines/community-grant-guideline.pdf');

    const res = await request(app)
      .post(`/api/assessments/${assessmentId}/guideline`)
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', sampleGuideline);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.document.type).toBe('GUIDELINE');
    expect(res.body.document.chunks.length).toBeGreaterThan(0);
  });

  it('POST /api/assessments/:id/application should upload and extract application PDF', async () => {
    const sampleApplication = path.resolve(__dirname, '../../../sample-documents/applications/community-grant-application.pdf');

    const res = await request(app)
      .post(`/api/assessments/${assessmentId}/application`)
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', sampleApplication);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.document.type).toBe('APPLICATION');
  });

  it('POST /api/assessments/:id/supporting-documents should upload supporting documents', async () => {
    const sampleCert = path.resolve(__dirname, '../../../sample-documents/supporting/registration-certificate.pdf');

    const res = await request(app)
      .post(`/api/assessments/${assessmentId}/supporting-documents`)
      .set('Authorization', `Bearer ${authToken}`)
      .attach('files', sampleCert);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/assessments/:id/analyze should run multi-step AI workflow and compute score', async () => {
    const res = await request(app)
      .post(`/api/assessments/${assessmentId}/analyze`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.assessment.status).toBe('CURRENT');
    expect(res.body.assessment.completenessScore).toBeGreaterThanOrEqual(0);
  });

  it('GET /api/assessments/:id/results should return full requirements, mappings, and citations', async () => {
    const res = await request(app)
      .get(`/api/assessments/${assessmentId}/results`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.requirements.length).toBeGreaterThan(0);
    expect(res.body.mappings.length).toBeGreaterThan(0);

    // Save one mappingId for review test
    mappingId = res.body.mappings[0]._id;
  });

  it('PATCH /api/mappings/:mappingId should allow human review (CONFIRM/CORRECT)', async () => {
    const res = await request(app)
      .patch(`/api/mappings/${mappingId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        action: 'CONFIRM',
        comment: 'Verified against attached registration certificate.'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.mapping.humanAction).toBe('CONFIRM');
  });

  it('GET /api/assessments/:id/summary should return reviewed summary metrics', async () => {
    const res = await request(app)
      .get(`/api/assessments/${assessmentId}/summary`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.summary.confirmedCount).toBeGreaterThanOrEqual(1);
    expect(res.body.summary.completenessScore).toBeDefined();
  });
});
