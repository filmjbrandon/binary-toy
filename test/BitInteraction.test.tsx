import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import BitInteraction from '../src/components/BitInteraction';
import _ from 'lodash';
import userEvent from '@testing-library/user-event';
import { expect, test, afterEach } from 'vitest'

afterEach(()=>{
    cleanup()
})

test('interaction defaults to 8 bits', () => {
    render(<BitInteraction />);
    const bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(8);
});

test('interaction can set # of bits', () => {
    render(<BitInteraction numberOfBits={4} />);
    const bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(4);
    cleanup()
    render(<BitInteraction numberOfBits={11} />);
    const bits2 = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits2).toHaveLength(11);
    cleanup()
});

test('bit is toggleable on click', () => {
    render(<BitInteraction />);
    const mostBit = screen.getByTestId('bit-7')
    expect(mostBit).toHaveTextContent('0');
    fireEvent.click(mostBit);
    expect(mostBit).toHaveTextContent('1');
    const leastBit = screen.getByTestId('bit-0')
    expect(leastBit).toHaveTextContent('0');
    fireEvent.click(leastBit);
    expect(leastBit).toHaveTextContent('1');
  });

test('updating bits updates int value', () => {
    render(<BitInteraction />);
    const leastBit = screen.getByTestId('bit-0');
    const intValue = screen.getByTestId('int-value');
    expect(intValue).toHaveValue('0');
    fireEvent.click(leastBit);
    expect(leastBit).toHaveTextContent('1');
    expect(intValue).toHaveValue('1');
    const nextBit = screen.getByTestId('bit-1');
    fireEvent.click(nextBit);
    expect(intValue).toHaveValue('3');
});

test('interaction generates hex value', () => {
    render(<BitInteraction />);
    const bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    const hexValue = screen.getByTestId('hex-value');
    fireEvent.click(bits[0]);
    expect(hexValue).toHaveValue('0x01');
    fireEvent.click(bits[1]);
    expect(hexValue).toHaveValue('0x03');
    fireEvent.click(bits[6]);
    fireEvent.click(bits[7]);
    expect(hexValue).toHaveValue('0xC3');
});

test('can add bits', () => {
    render(<BitInteraction numberOfBits={2} />);
    let bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(2);
    const button = screen.getByTestId('add-bit');
    expect(button).toHaveTextContent('Add Bit');
    console.log("add 1 bit")
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits).toHaveLength(3);
});

test('adding bits does not alter existing state', () => {
    console.log("starting with 2 bits")
    render(<BitInteraction startingIntValue={10} />);
    const button = screen.getByTestId('add-bit');
    console.log("adding 1 bit")
    fireEvent.click(button);
    const intValue = screen.getByTestId('int-value');
    expect(intValue).toHaveValue('10');
    console.log("adding 1 bit")
    fireEvent.click(button);
    console.log("adding 1 bit")
    fireEvent.click(button);
    expect(intValue).toHaveValue('10');
    console.log("cleanup")
})

test('bit interaction can be loaded with a default value that is multiple of 8', () => {
    render(<BitInteraction startingIntValue={24} />);
    const bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    const intValue = screen.getByTestId('int-value')
    expect(intValue).toHaveValue('24')
    expect(bits[0]).toHaveTextContent('0')
    expect(bits[1]).toHaveTextContent('0')
    expect(bits[2]).toHaveTextContent('0')
    expect(bits[3]).toHaveTextContent('1')
    expect(bits[4]).toHaveTextContent('1')
})

test('bit interaction can be loaded with a default value that is not a multiple of 8', () => {
    render(<BitInteraction startingIntValue={23} />);
    const bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    const intValue = screen.getByTestId('int-value')
    expect(intValue).toHaveValue('23')
    expect(bits[0]).toHaveTextContent('1')
    expect(bits[1]).toHaveTextContent('1')
    expect(bits[2]).toHaveTextContent('1')
    expect(bits[3]).toHaveTextContent('0')
    expect(bits[4]).toHaveTextContent('1')
})


test('when int value is changed, hexValue is updated as well', ()=>{
    render(<BitInteraction startingIntValue={10} />)
    const intValue = screen.getByTestId('int-value')
    const hexValue = screen.getByTestId('hex-value')
    expect(intValue).toHaveValue('10')
    expect(hexValue).toHaveValue('0x0A')
})

test('can reset interaction', () => {
    render(<BitInteraction numberOfBits={3} />);
    let bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(3);
    let button = screen.getByTestId('add-bit');
    expect(button).toHaveTextContent('Add Bit');
    fireEvent.click(button);
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/i);
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
    bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(5);
});

test('reset interaction clears display values', () => {
    render(<BitInteraction numberOfBits={2} />);
    const hexValue = screen.getByTestId('hex-value');
    const intValue = screen.getByTestId('int-value');
    const button = screen.getByTestId('reset');
    const bits = screen.getAllByTestId(/^bit-[0-9]+/i);
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
    let bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(3);
    let button = screen.getByTestId('remove-bit');
    expect(button).toHaveTextContent('Remove Bit');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(2);
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
    const bits = screen.getAllByTestId(/^bit-[0-9]+/);
    fireEvent.click(bits[6]);
    fireEvent.click(bits[0]);
    expect(textbox).toHaveValue('A');
});

test('can see bit #s', () => {
    render(<BitInteraction />);
    const labels = screen.getAllByTestId('bit-label');
    const bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(labels[0]).toHaveTextContent('0');
    expect(labels[7]).toHaveTextContent('7');
});

test('break new bytes onto new row', () => {
    render(<BitInteraction numberOfBits={9} />);
    const bytes = screen.getAllByTestId('byte');
    expect(bytes[1]).toBeInTheDocument();
})

test('hex value should 0pad for each new byte', () => {
    render(<BitInteraction numberOfBits={8} />);
    const bits = screen.getAllByTestId(/^bit-[0-9]+/);
    const result = screen.getByTestId('hex-value');
    fireEvent.click(bits[0]);
    expect(result).toHaveValue('0x01');
    const button = screen.getByTestId('add-bit');
    fireEvent.click(button);
    expect(result).toHaveValue('0x0001');
})

test('can display colors with 3 bytes', () => {
    render(<BitInteraction numberOfBits={25}/>);
    const bits = screen.getAllByTestId(/^bit-[0-9]+/);
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
    let bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(8);

    const button = screen.getByTestId('add-byte');
    expect(button).toHaveTextContent('Add Byte');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(16);
})

test('can remove a byte at a time', () => {
    render(<BitInteraction numberOfBits={15} />);
    let bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(15);

    const button = screen.getByTestId('remove-byte');
    expect(button).toHaveTextContent('Remove Byte');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(8);
})

test('can delete a bit after deleting a byte', () => {
    render(<BitInteraction numberOfBits={9} />);
    let bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits).toHaveLength(9);

    let button = screen.getByTestId('remove-byte');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(8);

    button = screen.getByTestId('remove-bit');
    expect(button).toHaveTextContent('Remove Bit');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
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
    let bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(8);
    const up = screen.getByTestId('inc-value');
    

    _.range(8).forEach(i => {
        fireEvent.click(bits[i]);
    });
    const intVal = screen.getByTestId('int-value');
    expect(intVal).toHaveValue('255');
    fireEvent.click(up);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(intVal).toHaveValue('256')    
})

// test('Rebuild the bit array based on the incremented value', () => {
//     render(<BitInteraction />)
//     let bits = screen.getAllByTestId(/^bit-[0-9]+/);
//     const up = screen.getByTestId('inc-value');
//     fireEvent.click(bits[0]);
//     bits = screen.getAllByTestId(/^bit-[0-9]+/);
//     expect(bits[0]).toHaveTextContent('1');
//     fireEvent.click(up);
//     bits = screen.getAllByTestId(/^bit-[0-9]+/);
//     expect(bits[1]).toHaveTextContent('1');
//     expect(bits[0]).toHaveTextContent('0');
// })

// test('can decrement the integer value', () => {
//     render(<BitInteraction numberOfBits={9}/>)
//     const down = screen.getByTestId('dec-value');
//     const intVal = screen.getByTestId('int-value');
//     let bits = screen.getAllByTestId(/^bit-[0-9]+/);    
//     fireEvent.click(bits[8]);  
//     expect(intVal).toHaveValue('256')  
//     fireEvent.click(down);
//     expect(intVal).toHaveValue('255')
// })

// test('Rebuild the bit array based on the decremented value', () => {
//     render(<BitInteraction />)
//     let bits = screen.getAllByTestId(/^bit-[0-9]+/);
//     expect(bits.length).toBe(8);
//     const down = screen.getByTestId('dec-value');
//     fireEvent.click(bits[0]);
//     bits = screen.getAllByTestId(/^bit-[0-9]+/);
//     expect(bits[0]).toHaveTextContent('0');
//     fireEvent.click(down);
//     bits = screen.getAllByTestId(/^bit-[0-9]+/);
//     expect(bits[0]).toHaveTextContent('0');
    
// })

// test('can set bit values from input', () => {
//     render(<BitInteraction />);
//     const textbox = screen.getByTestId('int-value');
//     fireEvent.click(textbox);
//     expect(textbox).toBeEnabled();    
//     userEvent.type(textbox, '65');
//     expect(textbox).toHaveValue('65');
//     let bits = screen.getAllByTestId(/^bit-[0-9]+/);
//     expect(bits).toHaveLength(7);
//     expect(bits[0]).toHaveTextContent('1');
//     expect(bits[6]).toHaveTextContent('1');
//     expect(textbox).toBeDisabled();
// });
