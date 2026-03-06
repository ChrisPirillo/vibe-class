import { describe, expect, it } from 'vitest';
import { getPortfolioStatusMessage } from '@/lib/portfolio-feedback';

describe('getPortfolioStatusMessage', () => {
  it('returns submitted success message', () => {
    expect(getPortfolioStatusMessage('submitted')).toEqual({
      tone: 'success',
      text: 'Your app was submitted and added to your portfolio.'
    });
  });

  it('returns null for unknown statuses', () => {
    expect(getPortfolioStatusMessage('anything-else')).toBeNull();
    expect(getPortfolioStatusMessage(undefined)).toBeNull();
  });
});
