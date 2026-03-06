import { describe, expect, it } from 'vitest';
import { isKeywordDuplicate, normalizeKeyword } from '@/lib/submission-rules';

describe('submission validation rule', () => {
  it('rejects case-insensitive duplicates', () => {
    expect(isKeywordDuplicate(['Game', 'Calculator'], 'game')).toBe(true);
    expect(isKeywordDuplicate(['GAME'], '  game  ')).toBe(true);
  });

  it('rejects duplicates despite surrounding whitespace', () => {
    expect(isKeywordDuplicate(['  clock  '], 'clock')).toBe(true);
    expect(isKeywordDuplicate(['clock'], '   CLOCK   ')).toBe(true);
  });

  it('allows distinct keywords', () => {
    expect(isKeywordDuplicate(['Game'], 'Clock')).toBe(false);
  });

  it('normalizes keywords consistently', () => {
    expect(normalizeKeyword('  CaLcUlAtOr  ')).toBe('calculator');
  });
});
