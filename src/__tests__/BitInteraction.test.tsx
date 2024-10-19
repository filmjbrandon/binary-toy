import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import BitInteraction from '../BitInteraction';
import userEvent from '@testing-library/user-event';

test('interaction defaults to 2 bits', () => {
    render(<BitInteraction />);
    const bits = screen.getAllByTestId('bit');
    expect(bits).toHaveLength(2);
});

test('interaction can set # of bits', () => {
    render(<BitInteraction numberOfBits={8} />);
    const bits = screen.getAllByTestId('bit');
    expect(bits).toHaveLength(8);
});

test('interaction receives updates of bit values', () => {
    render(<BitInteraction />);
    const bits = screen.getAllByTestId('bit');
    const result = screen.getByRole('textbox');
    fireEvent.click(bits[0]);
    expect(result).toHaveValue('1');
    fireEvent.click(bits[1]);
    expect(result).toHaveValue('3');
    fireEvent.click(bits[0]);
    expect(result).toHaveValue('2');
});

// test('can set bit values from input', () => {
//     render(<BitInteraction />);
//     const textbox = screen.getByRole('textbox');
//     userEvent.type(textbox, '2');
//     let bits = screen.getAllByTestId('bit');
//     expect(textbox).toHaveValue('2');
//     expect(bits).toHaveLength(2);
//     expect(bits[0]).toHaveTextContent('0');
//     expect(bits[1]).toHaveTextContent('1');
//     userEvent.type(textbox, '4');
//     bits = screen.getAllByTestId('bit');
//     expect(bits).toHaveLength(3);    
//     expect(bits[2]).toHaveTextContent('1');
//     expect(bits[1]).toHaveTextContent('0');
//     expect(bits[0]).toHaveTextContent('0');
// });
