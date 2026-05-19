import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DisplayMessage from './DisplayMessage';

describe('DisplayMessage Component', () => {
  it('renders a fallback when no message is provided', () => {
    render(<DisplayMessage />);
    expect(screen.getByText('No message provided.')).toBeInTheDocument();
  });

  // Students will complete this test in Exercise 2
  it('renders the correct message prop', () => {
    // 1. Render the component with a message prop

    // 2. Find the element using screen.getByText()

    // 3. Assert it is in the document
    
  });
});
