import { describe, expect, it } from 'vitest';
import { getAdminStatusMessage } from '@/lib/admin-feedback';

describe('getAdminStatusMessage', () => {
  it('returns success messages for update/delete', () => {
    expect(getAdminStatusMessage('updated')).toEqual({ tone: 'success', text: 'Submission updated successfully.' });
    expect(getAdminStatusMessage('deleted')).toEqual({ tone: 'success', text: 'Submission deleted successfully.' });
  });

  it('returns error messages for known validation states', () => {
    expect(getAdminStatusMessage('validation_error')?.tone).toBe('error');
    expect(getAdminStatusMessage('duplicate_keyword')?.text).toMatch(/duplicate keyword/i);
  });

  it('returns null for unknown status', () => {
    expect(getAdminStatusMessage('made-up-status')).toBeNull();
    expect(getAdminStatusMessage(undefined)).toBeNull();
  });
});
