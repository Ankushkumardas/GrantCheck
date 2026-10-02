import { describe, it, expect } from 'vitest';
const { calculateCompleteness } = require('../../src/services/assessment/completenessCalculator');

describe('Deterministic Completeness Calculator', () => {
  it('should calculate 70% when 7 of 10 mandatory requirements are supported', () => {
    const requirements = Array.from({ length: 10 }, (_, i) => ({
      reqId: `REQ-${i + 1}`,
      mandatory: true
    }));

    const mappings = [
      ...Array.from({ length: 7 }, (_, i) => ({ reqId: `REQ-${i + 1}`, finalStatus: 'SUPPORTED' })),
      { reqId: 'REQ-8', finalStatus: 'WEAK' },
      { reqId: 'REQ-9', finalStatus: 'AMBIGUOUS' },
      { reqId: 'REQ-10', finalStatus: 'MISSING' }
    ];

    const result = calculateCompleteness(requirements, mappings);

    expect(result.completenessScore).toBe(70);
    expect(result.mandatoryTotal).toBe(10);
    expect(result.mandatorySupported).toBe(7);
    expect(result.mandatoryWeak).toBe(1);
    expect(result.mandatoryAmbiguous).toBe(1);
    expect(result.mandatoryMissing).toBe(1);
  });

  it('should calculate 100% when all mandatory requirements are supported', () => {
    const requirements = Array.from({ length: 5 }, (_, i) => ({
      reqId: `REQ-${i + 1}`,
      mandatory: true
    }));

    const mappings = Array.from({ length: 5 }, (_, i) => ({
      reqId: `REQ-${i + 1}`,
      finalStatus: 'SUPPORTED'
    }));

    const result = calculateCompleteness(requirements, mappings);
    expect(result.completenessScore).toBe(100);
    expect(result.mandatorySupported).toBe(5);
  });

  it('should calculate 0% when 0 mandatory requirements are supported', () => {
    const requirements = Array.from({ length: 4 }, (_, i) => ({
      reqId: `REQ-${i + 1}`,
      mandatory: true
    }));

    const mappings = Array.from({ length: 4 }, (_, i) => ({
      reqId: `REQ-${i + 1}`,
      finalStatus: 'MISSING'
    }));

    const result = calculateCompleteness(requirements, mappings);
    expect(result.completenessScore).toBe(0);
  });

  it('should return 0% when there are no mandatory requirements', () => {
    const result = calculateCompleteness([], []);
    expect(result.completenessScore).toBe(0);
    expect(result.mandatoryTotal).toBe(0);
  });

  it('should NOT let recommended requirements affect the mandatory completeness score', () => {
    const requirements = [
      { reqId: 'REQ-1', mandatory: true },
      { reqId: 'REQ-2', mandatory: true },
      { reqId: 'REQ-3', mandatory: false }, // Recommended
      { reqId: 'REQ-4', mandatory: false }  // Recommended
    ];

    const mappings = [
      { reqId: 'REQ-1', finalStatus: 'SUPPORTED' },
      { reqId: 'REQ-2', finalStatus: 'MISSING' },
      { reqId: 'REQ-3', finalStatus: 'SUPPORTED' }, // Should not boost mandatory score
      { reqId: 'REQ-4', finalStatus: 'SUPPORTED' }
    ];

    const result = calculateCompleteness(requirements, mappings);

    // 1 supported out of 2 mandatory = 50%
    expect(result.completenessScore).toBe(50);
    expect(result.mandatoryTotal).toBe(2);
    expect(result.mandatorySupported).toBe(1);
    expect(result.recommendedTotal).toBe(2);
    expect(result.recommendedSupported).toBe(2);
  });

  it('should prioritize human reviewed status over AI status', () => {
    const requirements = [
      { reqId: 'REQ-1', mandatory: true },
      { reqId: 'REQ-2', mandatory: true }
    ];

    // AI marked REQ-2 as WEAK, but human reviewed and CORRECTED to SUPPORTED
    const mappings = [
      { reqId: 'REQ-1', aiStatus: 'SUPPORTED', humanStatus: null, finalStatus: 'SUPPORTED' },
      { reqId: 'REQ-2', aiStatus: 'WEAK', humanStatus: 'SUPPORTED', finalStatus: 'SUPPORTED' }
    ];

    const result = calculateCompleteness(requirements, mappings);

    expect(result.completenessScore).toBe(100);
    expect(result.mandatorySupported).toBe(2);
  });
});
