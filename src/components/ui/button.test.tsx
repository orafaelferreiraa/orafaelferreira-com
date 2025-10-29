import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './button';

describe('Button (ui)', () => {
  it('renders with text and role button', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
  });

  it('applies variant classnames', () => {
    const { rerender } = render(<Button variant="destructive">Danger</Button>);
    const btn = screen.getByRole('button', { name: /danger/i });
    expect(btn.className).toMatch(/destructive/i);

    rerender(<Button variant="link">Go</Button>);
    expect(screen.getByRole('button', { name: /go/i }).className).toMatch(/underline/);
  });
});
