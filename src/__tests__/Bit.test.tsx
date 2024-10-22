import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Bit from '../Bit';

test('renders a bit', () => {
  render(<Bit />);
  const button = screen.getByRole('button');
  expect(button).toHaveTextContent('0');
  expect(button).toHaveClass('bit');
});

test('bit is toggleable', () => {
  render(<Bit />);
  const button = screen.getByRole('button');
  expect(button).toHaveTextContent('0');
  fireEvent.click(button);
  expect(button).toHaveTextContent('1');
  fireEvent.click(button);
  expect(button).toHaveTextContent('0');
  fireEvent.click(button);
  expect(button).toHaveTextContent('1');
});

test('Bit ID is set on button from index', () => {
  render(<Bit index={1} />);
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('id', 'bit-1');
});

test('can reset bit', () => {
  render(<Bit />)
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(button).toHaveTextContent('1');
  render(<Bit setValue={1} />)
  expect(button).toHaveTextContent('1');
  fireEvent.click(button);
  expect(button).toHaveTextContent('0');

});

test('displays bit number', () => {
  render(<Bit />)
  const label = screen.getByTestId('bit-label');
  expect(label).toHaveTextContent('1'); 
})

test('bit can be reset manually', () => {
  render(<Bit setValue={1} />)
  const button = screen.getByRole('button');
  expect(button).toHaveTextContent('1');
  fireEvent.click(button);
  expect(button).toHaveTextContent('0');
})