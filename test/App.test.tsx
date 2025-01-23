import { cleanup, render, screen } from '@testing-library/react';
import App from '../src/App';
import { expect, test } from 'vitest'

test('App renders BitInteraction', () => {
  render(<App />);
  const interaction = screen.getByTestId('bit-interaction');
  expect(interaction).toBeInTheDocument();
  cleanup()
});
