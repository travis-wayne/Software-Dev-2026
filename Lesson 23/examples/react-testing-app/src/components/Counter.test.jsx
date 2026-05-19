import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('Counter Component', () => {
  it('starts with a count of 0', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  // Students will complete this test in Exercise 3
  it('increments the count when the button is clicked', async () => {
    // 1. Setup userEvent
    const user = userEvent.setup();
    
    // 2. Render component
    render(<Counter />);
    
    // 3. Find the increment button
    const button = screen.getByRole('button', { name: /increment/i });
    
    // 4. Simulate click
    await user.click(button);
    
    // 5. Assert the new text is on the screen
    // expect(screen.getByText('...')).toBeInTheDocument();
  });
});
