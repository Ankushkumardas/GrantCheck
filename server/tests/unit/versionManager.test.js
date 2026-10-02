import { describe, it, expect } from 'vitest';
const { isAssessmentStale, getStaleReason } = require('../../src/services/assessment/versionManager');

describe('Version and Stale Assessment Manager', () => {
  it('should return false when versions match', () => {
    const assessment = { guidelineVersion: 1, applicationVersion: 1 };
    expect(isAssessmentStale(assessment, 1, 1)).toBe(false);
  });

  it('should return true when application version changed', () => {
    const assessment = { guidelineVersion: 1, applicationVersion: 1 };
    expect(isAssessmentStale(assessment, 1, 2)).toBe(true);
    const reason = getStaleReason(assessment, 1, 2);
    expect(reason).toContain('Draft Application changed');
  });

  it('should return true when guideline version changed', () => {
    const assessment = { guidelineVersion: 1, applicationVersion: 1 };
    expect(isAssessmentStale(assessment, 2, 1)).toBe(true);
    const reason = getStaleReason(assessment, 2, 1);
    expect(reason).toContain('Guideline changed');
  });

  it('should return true when both versions changed', () => {
    const assessment = { guidelineVersion: 1, applicationVersion: 1 };
    expect(isAssessmentStale(assessment, 2, 3)).toBe(true);
    const reason = getStaleReason(assessment, 2, 3);
    expect(reason).toContain('Guideline changed');
    expect(reason).toContain('Draft Application changed');
  });
});
