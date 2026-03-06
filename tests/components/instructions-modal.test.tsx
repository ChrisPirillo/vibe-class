import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { InstructionsModal } from '@/components/InstructionsModal';

describe('InstructionsModal', () => {
  it('opens and closes modal', async () => {
    const user = userEvent.setup();
    render(<InstructionsModal />);
    await user.click(screen.getByRole('button', { name: /conversion instructions/i }));
    expect(screen.getByText(/Gemini Conversion Instructions/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByText(/Gemini Conversion Instructions/i)).not.toBeInTheDocument();
  });
});
