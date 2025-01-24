import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Bit from '../src/components/Bit';
import { expect, test, afterEach } from 'vitest'

afterEach(()=>{
  cleanup()
})

test('renders a bit', () => {
  render(<Bit />);
  const bit = screen.getByTestId('bit-0');
  expect(bit).toHaveTextContent('0');
  expect(bit).toHaveClass('bit');
});

test('Bit ID can be set using index', () => {
  render(<Bit index={1} />);
  const bit = screen.getByTestId('bit-1');
  expect(bit).toHaveAttribute('id', 'bit-1');
});

test('can set value for a bit', () => {
  render(<Bit defaultValue={1} />)
  const bit = screen.getByTestId('bit-0');
  expect(bit).toHaveTextContent('1');
  cleanup()
  
  render(<Bit defaultValue={0} />)
  const bit2 = screen.getByTestId('bit-0');
  expect(bit2).toHaveTextContent('0');
  cleanup()
});

test('displays bit number', () => {
  render(<Bit index={7} />)
  const label = screen.getByTestId('bit-label');
  expect(label).toHaveTextContent('7'); 
})

test('by default bit can be toggled', () => {
  render(<Bit />)
  const bit = screen.getByTestId('bit-0');
  expect(bit).toHaveTextContent('0'); 
  fireEvent.click(bit)
  expect(bit).toHaveTextContent('1'); 
  fireEvent.click(bit)
  expect(bit).toHaveTextContent('0');   
})