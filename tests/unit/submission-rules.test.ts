import { describe, expect, it } from 'vitest';
import { isKeywordDuplicate } from '@/lib/submission-rules';

describe('submission validation rule', () => {
  it('rejects case-insensitive duplicates', () => {
    expect(isKeywordDuplicate(['Game', 'Calculator'], 'game')).toBe(true);
    expect(isKeywordDuplicate(['GAME'], '  game  ')).toBe(true);
  });

  it('allows distinct keywords', () => {
    expect(isKeywordDuplicate(['Game'], 'Clock')).toBe(false);
  });
});
