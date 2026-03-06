import { describe, expect, it } from 'vitest';
import { safeName } from '@/lib/filename';

describe('safeName', () => {
  it('replaces non-alphanumeric characters with underscores', () => {
    expect(safeName('Ada Lovelace')).toBe('Ada_Lovelace');
    expect(safeName('game/calculator:v1')).toBe('game_calculator_v1');
  });

  it('preserves letters, numbers, dashes, and underscores', () => {
    expect(safeName('Student-12_keyword_3')).toBe('Student-12_keyword_3');
  });
});
