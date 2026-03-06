import { describe, expect, it } from 'vitest';
import { getSubmitStatusMessage } from '@/lib/submit-feedback';

describe('getSubmitStatusMessage', () => {
  it('returns success status', () => {
    expect(getSubmitStatusMessage('submitted')).toEqual({ tone: 'success', text: 'Submission received successfully.' });
  });

  it('returns error statuses', () => {
    expect(getSubmitStatusMessage('invalid_email')?.tone).toBe('error');
    expect(getSubmitStatusMessage('duplicate_keyword')?.text).toMatch(/already submitted/i);
  });

  it('returns null for unknown status', () => {
    expect(getSubmitStatusMessage('whatever')).toBeNull();
  });
});
