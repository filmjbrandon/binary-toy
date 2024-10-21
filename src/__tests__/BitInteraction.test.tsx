import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import BitInteraction from '../BitInteraction';
// import userEvent from '@testing-library/user-event';

test('interaction defaults to 8 bits', () => {
    render(<BitInteraction />);
    const bits = screen.getAllByTestId('bit');
    expect(bits).toHaveLength(8);
});

test('interaction can set # of bits', () => {
    render(<BitInteraction numberOfBits={8} />);
    const bits = screen.getAllByTestId('bit');
    expect(bits).toHaveLength(8);
});

test('interaction generates int value', () => {
    render(<BitInteraction />);
    const bits = screen.getAllByTestId('bit');
    const result = screen.getByTestId('int-value');
    fireEvent.click(bits[0]);
    expect(result).toHaveValue('1');
    fireEvent.click(bits[1]);
    expect(result).toHaveValue('3');
    fireEvent.click(bits[0]);
    expect(result).toHaveValue('2');
});

test('interaction generates hex value', () => {
    render(<BitInteraction />);
    const bits = screen.getAllByTestId('bit');
    const result = screen.getByTestId('hex-value');
    fireEvent.click(bits[0]);
    expect(result).toHaveValue('0x01');
    fireEvent.click(bits[1]);
    expect(result).toHaveValue('0x03');
    fireEvent.click(bits[6]);
    fireEvent.click(bits[7]);
    expect(result).toHaveValue('0xC3');
});

test('can add bits', () => {
    render(<BitInteraction numberOfBits={2} />);
    let bits = screen.getAllByTestId('bit');
    expect(bits).toHaveLength(2);
    const button = screen.getByTestId('add-bit');
    expect(button).toHaveTextContent('Add Bit');
    fireEvent.click(button);
    bits = screen.getAllByTestId('bit');
    expect(bits).toHaveLength(3);
});

test('can reset interaction', () => {
    render(<BitInteraction numberOfBits={3} />);
    let bits = screen.getAllByTestId('bit');
    expect(bits).toHaveLength(3);
    let button = screen.getByTestId('add-bit');
    expect(button).toHaveTextContent('Add Bit');
    fireEvent.click(button);
    fireEvent.click(button);
    bits = screen.getAllByTestId('bit');
    expect(bits).toHaveLength(5);
    fireEvent.click(bits[0])
    expect(bits[0]).toHaveTextContent('1');
    fireEvent.click(bits[1])
    expect(bits[1]).toHaveTextContent('1');
    button = screen.getByTestId('reset');
    expect(button).toHaveTextContent('Reset');
    fireEvent.click(button);
    expect(bits[0]).toHaveTextContent('0');
    expect(bits[1]).toHaveTextContent('0');
    bits = screen.getAllByTestId('bit');
    expect(bits).toHaveLength(5);
});

test('reset interaction clears display values', () => {
    render(<BitInteraction numberOfBits={2} />);
    const hexValue = screen.getByTestId('hex-value');
    const intValue = screen.getByTestId('int-value');
    const button = screen.getByTestId('reset');
    const bits = screen.getAllByTestId('bit');
    fireEvent.click(bits[1]);
    expect(intValue).toHaveValue('2');
    expect(hexValue).toHaveValue('0x02');
    fireEvent.click(button);
    expect(bits[1]).toHaveTextContent('0');
    expect(intValue).toHaveValue('0');
    expect(hexValue).toHaveValue('0x00');
});

test('can delete a bit from the interaction', () => {
    render(<BitInteraction numberOfBits={3} />);
    let bits = screen.getAllByTestId('bit');
    expect(bits).toHaveLength(3);
    fireEvent.click(bits[1]);
    expect(bits[1]).toHaveTextContent('1');    
    let button = screen.getByTestId('remove-bit');
    expect(button).toHaveTextContent('Remove Bit');
    fireEvent.click(button);
    bits = screen.getAllByTestId('bit');
    expect(bits).toHaveLength(2);
    expect(bits[1]).toHaveTextContent('1');
})

test('can see number of bits', () => {
    render(<BitInteraction numberOfBits={3} />);
    let textbox = screen.getByTestId('bit-count');
    expect(textbox).toHaveValue('3');
    let button = screen.getByTestId('add-bit');
    fireEvent.click(button);
    expect(textbox).toHaveValue('4');
    button = screen.getByTestId('remove-bit');
    fireEvent.click(button);
    expect(textbox).toHaveValue('3');
})

test('can see character', () => {
    render(<BitInteraction />);
    let textbox = screen.getByTestId('char');
    const bits = screen.getAllByTestId('bit');
    fireEvent.click(bits[6]);
    fireEvent.click(bits[0]);
    expect(textbox).toHaveValue('A');
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
