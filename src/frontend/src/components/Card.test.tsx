import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from './Card';

describe('Card', () => {
  it('renders the book title', () => {
    render(<Card title="Harry Potter" pictureUrl="/cover.jpg" isbn="1234567890" />);
    expect(screen.getByText('Harry Potter')).toBeInTheDocument();
  });

  it('links to the book page', () => {
    render(<Card title="Harry Potter" pictureUrl="/cover.jpg" isbn="1234567890" />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/book/1234567890');
  });
});
