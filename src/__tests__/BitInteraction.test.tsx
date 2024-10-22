import { fireEvent, render, screen } from '@testing-library/react';
import BitInteraction from '../BitInteraction';
import _ from 'lodash';
import userEvent from '@testing-library/user-event';
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
    let textbox = screen.getByTestId('char-value');
    const bits = screen.getAllByTestId('bit');
    fireEvent.click(bits[6]);
    fireEvent.click(bits[0]);
    expect(textbox).toHaveValue('A');
});

test('can see bit #s', () => {
    render(<BitInteraction />);
    const labels = screen.getAllByTestId('bit-label');
    const bits = screen.getAllByTestId('bit');
    expect(labels[0]).toHaveTextContent('1');
    expect(labels[7]).toHaveTextContent('8');
});

test('break new bytes onto new row', () => {
    render(<BitInteraction numberOfBits={9} />);
    const bytes = screen.getAllByTestId('byte');
    expect(bytes[1]).toBeInTheDocument();
})

test('hex value should 0pad for each new byte', () => {
    render(<BitInteraction numberOfBits={8} />);
    const bits = screen.getAllByTestId('bit');
    const result = screen.getByTestId('hex-value');
    fireEvent.click(bits[0]);
    expect(result).toHaveValue('0x01');
    const button = screen.getByTestId('add-bit');
    fireEvent.click(button);
    expect(result).toHaveValue('0x0001');
})

test('can display colors with 3 bytes', () => {
    render(<BitInteraction numberOfBits={25}/>);
    const bits = screen.getAllByTestId('bit');
    // setting value of bits to red
    _.range(8).forEach(i => {
        fireEvent.click(bits[i]);
    });
    let textbox = screen.getByTestId('color-value');
    expect(textbox).toHaveValue('#0000FF');    
    textbox = screen.getByTestId('color-value');
    expect(textbox).toHaveStyle('background-color: rgb(0, 0, 255)');    
})

test('hovering over a textbox will reveal full text', () => {
    render(<BitInteraction />);
    // cast to HTMLInputElement to avoid the error of not having "value" on HTMLElement
    const textboxes = screen.getAllByRole('textbox') as HTMLInputElement[];
    textboxes.forEach((box)=>{
        userEvent.hover(box);
        expect(box.title).toBe(box.value)
    });
});

test('can add a byte at a time', () => {
    render(<BitInteraction />);
    let bits = screen.getAllByTestId('bit');
    expect(bits.length).toBe(8);

    const button = screen.getByTestId('add-byte');
    expect(button).toHaveTextContent('Add Byte');
    fireEvent.click(button);
    bits = screen.getAllByTestId('bit');
    expect(bits.length).toBe(16);
})

test('can remove a byte at a time', () => {
    render(<BitInteraction numberOfBits={15} />);
    let bits = screen.getAllByTestId('bit');
    expect(bits.length).toBe(15);

    const button = screen.getByTestId('remove-byte');
    expect(button).toHaveTextContent('Remove Byte');
    fireEvent.click(button);
    bits = screen.getAllByTestId('bit');
    expect(bits.length).toBe(8);
})

test('can delete a bit after deleting a byte', () => {
    render(<BitInteraction numberOfBits={9} />);
    let bits = screen.getAllByTestId('bit');
    expect(bits).toHaveLength(9);

    let button = screen.getByTestId('remove-byte');
    fireEvent.click(button);
    bits = screen.getAllByTestId('bit');
    expect(bits.length).toBe(8);

    button = screen.getByTestId('remove-bit');
    expect(button).toHaveTextContent('Remove Bit');
    fireEvent.click(button);
    bits = screen.getAllByTestId('bit');
    expect(bits).toHaveLength(7);
})


test('only display characters up to int 65535',() => {
    render(<BitInteraction />)
    let bytes = screen.getAllByTestId('byte');
    expect(bytes.length).toBe(1);

    const button = screen.getByTestId('add-byte');
    fireEvent.click(button);
    bytes = screen.getAllByTestId('byte');
    expect(bytes.length).toBe(2);

    const textbox = screen.getByTestId('char-value');
    expect(textbox).toBeInTheDocument();
    fireEvent.click(button);
    bytes = screen.getAllByTestId('byte');
    expect(bytes.length).toBe(3);
    expect(textbox).toBeEmptyDOMElement();
    
})

test('can increment the integer value', () => {
    render(<BitInteraction />)
    let bits = screen.getAllByTestId('bit');
    expect(bits.length).toBe(8);
    const up = screen.getByTestId('inc-value');
    

    _.range(8).forEach(i => {
        fireEvent.click(bits[i]);
    });
    const intVal = screen.getByTestId('int-value');
    expect(intVal).toHaveValue('255');
    fireEvent.click(up);
    bits = screen.getAllByTestId('bit');
    expect(intVal).toHaveValue('256')    
})

test('Rebuild the bit array based on the incremented value', () => {
    render(<BitInteraction />)
    let bits = screen.getAllByTestId('bit');
    const up = screen.getByTestId('inc-value');
    fireEvent.click(bits[0]);
    bits = screen.getAllByTestId('bit');
    expect(bits[0]).toHaveTextContent('1');
    fireEvent.click(up);
    bits = screen.getAllByTestId('bit');
    expect(bits[1]).toHaveTextContent('1');
    expect(bits[0]).toHaveTextContent('0');
})

test('can decrement the integer value', () => {
    render(<BitInteraction numberOfBits={9}/>)
    const down = screen.getByTestId('dec-value');
    const intVal = screen.getByTestId('int-value');
    let bits = screen.getAllByTestId('bit');    
    fireEvent.click(bits[8]);  
    expect(intVal).toHaveValue('256')  
    fireEvent.click(down);
    expect(intVal).toHaveValue('255')
})

test('Rebuild the bit array based on the decremented value', () => {
    render(<BitInteraction />)
    let bits = screen.getAllByTestId('bit');
    expect(bits.length).toBe(8);
    const down = screen.getByTestId('dec-value');
    fireEvent.click(bits[0]);
    bits = screen.getAllByTestId('bit');
    expect(bits[0]).toHaveTextContent('0');
    fireEvent.click(down);
    bits = screen.getAllByTestId('bit');
    expect(bits[0]).toHaveTextContent('0');
    
})

// test('can set bit values from input', () => {
//     render(<BitInteraction />);
//     const textbox = screen.getByTestId('int-value');
//     fireEvent.click(textbox);
//     expect(textbox).toBeEnabled();    
//     userEvent.type(textbox, '65');
//     expect(textbox).toHaveValue('65');
//     let bits = screen.getAllByTestId('bit');
//     expect(bits).toHaveLength(7);
//     expect(bits[0]).toHaveTextContent('1');
//     expect(bits[6]).toHaveTextContent('1');
//     expect(textbox).toBeDisabled();
// });
