import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('App renders BitInteraction', () => {
  render(<App />);
  const interaction = screen.getByTestId('bit-interaction');
  expect(interaction).toBeInTheDocument();
});
