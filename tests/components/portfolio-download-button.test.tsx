import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PortfolioDownloadButton } from '@/components/PortfolioDownloadButton';

vi.mock('file-saver', () => ({ saveAs: vi.fn() }));

describe('PortfolioDownloadButton', () => {
  it('renders and handles click', async () => {
    const user = userEvent.setup();
    render(<PortfolioDownloadButton studentName="Ada" submissions={[{ keyword: 'game', html_code: '<html></html>' }]} />);
    const button = screen.getByRole('button', { name: /download portfolio zip/i });
    expect(button).toBeInTheDocument();
    await user.click(button);
    expect(button).toBeEnabled();
  });
});
