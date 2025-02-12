import { fireEvent, render, screen, cleanup, waitFor } from '@testing-library/react';
import BitInteraction from '../src/components/BitInteraction';
import _, { remove } from 'lodash';
import userEvent from '@testing-library/user-event';
import { expect, test, afterEach } from 'vitest'

afterEach(() => {
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

test('interaction has bit controls', () => {
    render(<BitInteraction />)
    const bitControls = screen.getByTestId('bit-controls')
    expect(bitControls).toBeInTheDocument()
})

test('interaction has value controls', () => {
    render(<BitInteraction />)
    const valueControls = screen.getByTestId('value-controls')
    expect(valueControls).toBeInTheDocument()
})

test('updating bits updates int value', async () => {
    render(<BitInteraction />);
    const leastBit = screen.getByTestId('bit-0');
    const intValue = screen.getByTestId('int-value');
    expect(intValue).toHaveValue('0');
    fireEvent.click(leastBit);
    expect(leastBit).toHaveTextContent('1');
    waitFor(() => {
        expect(intValue).toHaveValue('1');
    })
    const nextBit = screen.getByTestId('bit-1');
    fireEvent.click(nextBit);
    waitFor(() => {
        expect(intValue).toHaveValue('3');
    })

});

test('interaction generates hex value', () => {
    render(<BitInteraction />);
    const bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    const hexValue = screen.getByTestId('hex-value');
    fireEvent.click(bits[0]);
    waitFor(() => {
        expect(hexValue).toHaveValue('0x01');
    })
    fireEvent.click(bits[1]);
    waitFor(() => {
        expect(hexValue).toHaveValue('0x03');
    })
    fireEvent.click(bits[6]);
    fireEvent.click(bits[7]);
    waitFor(() => {
        expect(hexValue).toHaveValue('0xC3');
    })
});

test('can add bits', () => {
    render(<BitInteraction numberOfBits={2} />);
    let bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(2);
    const button = screen.getByTestId('add-bit');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits).toHaveLength(3);
});

test('adding bits does not alter existing state', () => {
    console.debug("starting with 2 bits")
    render(<BitInteraction startingIntValue={10} />);
    const button = screen.getByTestId('add-bit');
    console.debug("adding 1 bit")
    fireEvent.click(button);
    const intValue = screen.getByTestId('int-value');
    expect(intValue).toHaveValue('10');
    console.debug("adding 1 bit")
    fireEvent.click(button);
    console.debug("adding 1 bit")
    fireEvent.click(button);
    expect(intValue).toHaveValue('10');
    console.debug("cleanup")
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


test('when int value is changed, hexValue is updated as well', () => {
    render(<BitInteraction startingIntValue={10} />)
    const intValue = screen.getByTestId('int-value')
    const hexValue = screen.getByTestId('hex-value')
    expect(intValue).toHaveValue('10')
    expect(hexValue).toHaveValue('0x0A')
})

test('can reset interaction', async () => {
    render(<BitInteraction numberOfBits={3} />);
    let bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    let resetBits = screen.getByTestId('reset-bits');
    fireEvent.click(bits[0])
    expect(bits[0]).toHaveTextContent('1');
    fireEvent.click(bits[1])
    expect(bits[1]).toHaveTextContent('1');
    fireEvent.click(resetBits)
    waitFor(() => {
        expect(bits[0]).toHaveTextContent('0')
        expect(bits[1]).toHaveTextContent('0')
    })
});

test('reset interaction clears display values', async () => {
    render(<BitInteraction numberOfBits={2} />);
    const hexValue = screen.getByTestId('hex-value');
    const intValue = screen.getByTestId('int-value');
    const button = screen.getByTestId('reset-bits');
    const bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    fireEvent.click(bits[1]);
    waitFor(() => {
        expect(intValue).toHaveValue('2');
        expect(hexValue).toHaveValue('0x02');
    })
    fireEvent.click(button);
    waitFor(() => {
        expect(bits[1]).toHaveTextContent('0');
        expect(intValue).toHaveValue('0');
        expect(hexValue).toHaveValue('0x00');
    })
});

test('can remove bits', () => {
    render(<BitInteraction numberOfBits={3} />);
    let bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(3);
    let button = screen.getByTestId('remove-bit');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(2);
})

test('removing bits changes bitCount', async () => {
    render(<BitInteraction numberOfBits={3} />);
    const bitCount = screen.getByTestId('bit-count');
    const removeBit = screen.getByTestId('remove-bit');
    expect(bitCount).toHaveValue('3');
    fireEvent.click(removeBit);
    waitFor(() => {
        expect(bitCount).toHaveValue('2');
    })
})

test('deleting a bit recalculates accurately', () => {
    render(<BitInteraction startingIntValue={255} />)
    const removeBit = screen.getByTestId('remove-bit')
    const intValue = screen.getByTestId('int-value')
    expect(intValue).toHaveValue('255')
    let bits = screen.getAllByTestId(/^bit-[0-9]+/)
    expect(bits.length).toBe(8)
    expect(bits[7]).toHaveTextContent('1')
    expect(bits[6]).toHaveTextContent('1')
    expect(bits[5]).toHaveTextContent('1')
    expect(bits[4]).toHaveTextContent('1')
    expect(bits[3]).toHaveTextContent('1')
    expect(bits[2]).toHaveTextContent('1')
    expect(bits[1]).toHaveTextContent('1')
    expect(bits[0]).toHaveTextContent('1')
    fireEvent.click(removeBit)
    bits = screen.getAllByTestId(/^bit-[0-9]+/)
    waitFor(() => {
        expect(intValue).toHaveValue('127')
        expect(bits[6]).toHaveTextContent('1')
        expect(bits[5]).toHaveTextContent('1')
        expect(bits[4]).toHaveTextContent('1')
        expect(bits[3]).toHaveTextContent('1')
        expect(bits[2]).toHaveTextContent('1')
        expect(bits[1]).toHaveTextContent('1')
        expect(bits[0]).toHaveTextContent('1')
        expect(bits.length).toBe(7)
    })
})

test('deleting a byte recalculates accurately', () => {
    render(<BitInteraction startingIntValue={32896} />)
    const removeByte = screen.getByTestId('remove-byte')
    const intValue = screen.getByTestId('int-value')
    expect(intValue).toHaveValue('32896')
    let bits = screen.getAllByTestId(/^bit-[0-9]+/)
    expect(bits.length).toBe(16)
    expect(bits[15]).toHaveTextContent('1')
    expect(bits[14]).toHaveTextContent('0')
    expect(bits[7]).toHaveTextContent('1')
    expect(bits[6]).toHaveTextContent('0')
    fireEvent.click(removeByte)
    bits = screen.getAllByTestId(/^bit-[0-9]+/)
    waitFor(() => {
        expect(intValue).toHaveValue('128')
        expect(bits.length).toBe(8)
        expect(bits[7]).toHaveTextContent('1')
        expect(bits[6]).toHaveTextContent('0')
    })
})

test('decrementing does not reduce bits', async () => {
    render(<BitInteraction startingIntValue={256} numberOfBits={9} />)
    let bits = screen.getAllByTestId(/^bit-[0-9]+/)
    expect(bits).toHaveLength(9)
    expect(bits[0]).toHaveTextContent('0')
    expect(bits[1]).toHaveTextContent('0')
    expect(bits[2]).toHaveTextContent('0')
    expect(bits[3]).toHaveTextContent('0')
    expect(bits[4]).toHaveTextContent('0')
    expect(bits[5]).toHaveTextContent('0')
    expect(bits[6]).toHaveTextContent('0')
    expect(bits[7]).toHaveTextContent('0')
    expect(bits[8]).toHaveTextContent('1')
    const decrement = screen.getAllByTestId('dec-value')[0]
    fireEvent.click(decrement)
    bits = screen.getAllByTestId(/^bit-[0-9]+/)
    waitFor(() => {
        expect(intValue).toHaveValue('255')
        expect(bits).toHaveLength(9)
        expect(bits[0]).toHaveTextContent('1')
        expect(bits[1]).toHaveTextContent('1')
        expect(bits[2]).toHaveTextContent('1')
        expect(bits[3]).toHaveTextContent('1')
        expect(bits[4]).toHaveTextContent('1')
        expect(bits[5]).toHaveTextContent('1')
        expect(bits[6]).toHaveTextContent('1')
        expect(bits[7]).toHaveTextContent('1')
        expect(bits[8]).toHaveTextContent('0')    
    })
})

test('incrementing may add a bit', async () => {
    render(<BitInteraction startingIntValue={3} numberOfBits={2} />)
    let bits = screen.getAllByTestId(/^bit-[0-9]+/)
    expect(bits[0]).toHaveTextContent('1')
    expect(bits[1]).toHaveTextContent('1')
    const add = screen.getAllByTestId('inc-value')[0]
    fireEvent.click(add)
    bits = screen.getAllByTestId(/^bit-[0-9]+/)
    const bitCount = screen.getByTestId('bit-count')
    waitFor(()=>{
        expect(bitCount).toHaveTextContent(bits.length.toString())
        expect(bits.length).toBe(3) // would become 0b100
        expect(bits[0]).toHaveTextContent('0')
        expect(bits[1]).toHaveTextContent('0')
        expect(bits[2]).toHaveTextContent('1')
    }) 
})

test('incrementing may add a byte', async () => {
    render(<BitInteraction startingIntValue={255} numberOfBits={8} />)
    let bits = screen.getAllByTestId(/^bit-[0-9]+/)
    const add = screen.getAllByTestId('inc-value')[0]
    const intValue = screen.getByTestId('int-value')
    fireEvent.click(add)
    bits = screen.getAllByTestId(/^bit-[0-9]+/)
    waitFor(()=>{
        expect(intValue).toHaveValue('256')
        expect(bits).toHaveLength(16)    
    })
    cleanup()
    render(<BitInteraction startingIntValue={65535} numberOfBits={8} />)
    fireEvent.click(add)
    waitFor(()=>{
        bits = screen.getAllByTestId(/^bit-[0-9]+/)
        expect(intValue).toHaveValue('65536')
        expect(bits).toHaveLength(24)
    })
})


test('can see number of bits', async () => {
    render(<BitInteraction numberOfBits={3} />);
    let textbox = screen.getByTestId('bit-count');
    expect(textbox).toHaveValue('3');
    let button = screen.getByTestId('add-bit');
    fireEvent.click(button);
    waitFor(() => {
        expect(textbox).toHaveValue('4');
    })
    button = screen.getByTestId('remove-bit');
    fireEvent.click(button);
    waitFor(() => {
        expect(textbox).toHaveValue('3');
    })

})

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

test('hex value should 0pad for each new byte', async () => {
    render(<BitInteraction numberOfBits={8} />);
    const bits = screen.getAllByTestId(/^bit-[0-9]+/);
    const result = screen.getByTestId('hex-value');
    fireEvent.click(bits[0]);
    waitFor(() => {
        expect(result).toHaveValue('0x01');
    })
    const button = screen.getByTestId('add-bit');
    fireEvent.click(button);
    waitFor(() => {
        expect(result).toHaveValue('0x0001');
    })
})


test('can add a byte at a time', () => {
    render(<BitInteraction />);
    let bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(8);

    const button = screen.getByTestId('add-byte');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(16);
})

test('can remove a byte at a time', () => {
    render(<BitInteraction numberOfBits={15} />);
    let bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(15);

    const button = screen.getByTestId('remove-byte');
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
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits).toHaveLength(7);
})


test('only display characters up to int 65535', () => {
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
    waitFor(() => {
        bytes = screen.getAllByTestId('byte');
        expect(bytes.length).toBe(3);
        expect(textbox).toBeEmptyDOMElement();
    })
})

test('can increment the integer value', async () => {
    render(<BitInteraction />)
    let bits = screen.getAllByTestId(/^bit-[0-9]+/)
    expect(bits.length).toBe(8)
    const up = screen.getAllByTestId('inc-value')[0] // they all do same thing
    _.range(8).forEach(i => {
        fireEvent.click(bits[i]);
    });
    const intVal = screen.getByTestId('int-value')
    expect(intVal).toHaveValue('255')
    fireEvent.click(up)
    bits = screen.getAllByTestId(/^bit-[0-9]+/)
    waitFor(() => {
        expect(intVal).toHaveValue('256')
    })
})


test('can increment the hex value', async () => {
    render(<BitInteraction />)
    let bits = screen.getAllByTestId(/^bit-[0-9]+/)
    expect(bits.length).toBe(8)
    const up = screen.getAllByTestId('inc-value')[0] // they all do same thing
    _.range(8).forEach(i => {
        fireEvent.click(bits[i]);
    });
    const intVal = screen.getByTestId('hex-value')
    expect(intVal).toHaveValue('0xFF')
    fireEvent.click(up)
    bits = screen.getAllByTestId(/^bit-[0-9]+/)
    waitFor(() => {
        expect(intVal).toHaveValue('0x0100')
    })
})

test('can decrement the integer value', async () => {
    render(<BitInteraction numberOfBits={9} />)
    const down = screen.getAllByTestId('dec-value')[0]  // they all do same thing 
    const intVal = screen.getByTestId('int-value');
    const bits = screen.getAllByTestId(/^bit-[0-9]+/);
    fireEvent.click(bits[8]);
    waitFor(() => {
        expect(intVal).toHaveValue('256')
        fireEvent.click(down);
        expect(intVal).toHaveValue('255')
    })
})

test('can decrement the hex value', async () => {
    render(<BitInteraction numberOfBits={9} />)
    const down = screen.getAllByTestId('dec-value')[0]  // they all do same thing 
    const intVal = screen.getByTestId('int-value');
    const bits = screen.getAllByTestId(/^bit-[0-9]+/);
    fireEvent.click(bits[8]);
    waitFor(() => {
        expect(intVal).toHaveValue('0x100')
        fireEvent.click(down);
        expect(intVal).toHaveValue('0xFF')
    })
})

test('can set bits from int value', async () => {
    render(<BitInteraction />);
    const textbox = screen.getByTestId('int-value');
    fireEvent.click(textbox);
    expect(textbox).toBeEnabled();
    userEvent.type(textbox, '65');
    userEvent.tab()
    waitFor(() => {
        expect(textbox).toHaveValue('65');
        let bits = screen.getAllByTestId(/^bit-[0-9]+/);
        expect(bits).toHaveLength(8);
        expect(bits[0]).toHaveTextContent('1')
        expect(bits[1]).toHaveTextContent('0')
        expect(bits[2]).toHaveTextContent('0')
        expect(bits[3]).toHaveTextContent('0')
        expect(bits[4]).toHaveTextContent('0')
        expect(bits[5]).toHaveTextContent('1')
        expect(bits[6]).toHaveTextContent('0')
        expect(bits[7]).toHaveTextContent('0')
    })
});

test('can add bit count from input', () => {
    render(<BitInteraction />);
    const textbox = screen.getByTestId('bit-count');
    expect(textbox).toHaveValue('8');
    fireEvent.click(textbox);
    expect(textbox).toBeEnabled();
    userEvent.clear(textbox);
    userEvent.type(textbox, '12');
    userEvent.tab()
    expect(textbox).toHaveValue('12');
    let bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits).toHaveLength(12);
});

test('can reduce bit count from input', () => {
    render(<BitInteraction />);
    const textbox = screen.getByTestId('bit-count');
    expect(textbox).toHaveValue('8');
    fireEvent.click(textbox);
    expect(textbox).toBeEnabled();
    userEvent.clear(textbox);
    userEvent.type(textbox, '3');
    userEvent.tab()
    expect(textbox).toHaveValue('3');
    let bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits).toHaveLength(3);
});

test('can set bit count from input on enter', () => {
    render(<BitInteraction />);
    const textbox = screen.getByTestId('bit-count');
    expect(textbox).toHaveValue('8');
    fireEvent.click(textbox);
    expect(textbox).toBeEnabled();
    userEvent.type(textbox, '12')
    userEvent.type(textbox,'{enter}')
    expect(textbox).toHaveValue('12');
    let bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits).toHaveLength(12);
});

test('can set hex value from input', () => {
    render(<BitInteraction />);
    const textbox = screen.getByTestId('hex-value');
    fireEvent.click(textbox);
    expect(textbox).toBeEnabled();
    userEvent.type(textbox, '{backspace}');
    userEvent.type(textbox, 'FF');
    userEvent.tab()
    waitFor(() => {
        expect(textbox).toHaveValue('0xFF');
        let bits = screen.getAllByTestId(/^bit-[0-9]+/);
        expect(bits).toHaveLength(12);
    })
});

test('can flip all bits in a byte', async () => {
    render(<BitInteraction numberOfBits={16} />)
    const flipAll = screen.getAllByTestId('flip-byte')
    const intValue = screen.getByTestId('int-value')
    fireEvent.click(flipAll[0])
    fireEvent.click(flipAll[1])
    waitFor(()=>{
        expect(intValue).toHaveValue('65535')
    })
})

test('can reset all bits in a byte', () => {
    render(<BitInteraction startingIntValue={65535} />)
    const resetAll = screen.getAllByTestId('reset-byte')
    const intValue = screen.getByTestId('int-value')
    fireEvent.click(resetAll[0])
    waitFor(()=>{
        expect(intValue).toHaveValue('255')
    })
    fireEvent.click(resetAll[1])
    waitFor(()=>{
        expect(intValue).toHaveValue('0')
    })
})
