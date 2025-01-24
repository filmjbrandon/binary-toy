import { cleanup, render, screen } from '@testing-library/react';
import App from '../src/App';
import { expect, test, beforeEach, afterEach } from 'vitest'

let interaction: InstanceType<typeof HTMLElement>

beforeEach(async () =>{
  render(<App />);
  interaction = screen.getByTestId('bit-interaction');
})

afterEach(async () => {
  cleanup()
})

test('App renders BitInteraction', () => {
  expect(interaction).toBeInTheDocument();
});

test('BitInteraction is visible in DOM', () => {
  expect(interaction).toBeVisible();
});