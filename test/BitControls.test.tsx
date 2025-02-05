import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, vi, test, beforeEach, afterEach } from 'vitest'
import BitControls from '../src/components/BitControls';
import userEvent from '@testing-library/user-event';

const readBits = (bits: string[]) => {
    return bits
}
const mockHandler = vi.fn().mockImplementation(readBits)

beforeEach(async () => {
    mockHandler.mockClear()
})

afterEach(async () => {
  mockHandler.mockClear()
  cleanup()
})

test('can add bit', ()=>{
    render(<BitControls onChangeBits={mockHandler} currentBitArray={['0','0','0','1']}/>)
    const addBit = screen.getByTestId('add-bit')
    fireEvent.click(addBit)
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toReturnWith(['0','0','0','1','0'])
    cleanup()
    mockHandler.mockClear()
    render(<BitControls onChangeBits={mockHandler} currentBitArray={['0','0','0','0','0','0','0','1']}/>)
    const addBitChunk = screen.getByTestId('add-bit')
    fireEvent.click(addBitChunk)
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toReturnWith(['0','0','0','0','0','0','0','1','0'])
})

test('can remove bit', ()=>{
    render(<BitControls onChangeBits={mockHandler} currentBitArray={['1','0','0','0']}/>)
    const removeBit = screen.getByTestId('remove-bit')
    fireEvent.click(removeBit)
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toReturnWith(['1','0','0'])
    cleanup()
    mockHandler.mockClear()
    render(<BitControls onChangeBits={mockHandler} currentBitArray={['1','0','0','0','0','0','0','1','1']}/>)
    const removeBit2 = screen.getByTestId('remove-bit')
    fireEvent.click(removeBit2)
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toReturnWith(['1','0','0','0','0','0','0','1'])
})

test('can add byte', ()=>{
    render(<BitControls onChangeBits={mockHandler} currentBitArray={['1','0','0','0']}/>)
    const addByte = screen.getByTestId('add-byte')
    fireEvent.click(addByte)
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toReturnWith(['1','0','0','0','0','0','0','0'])
    cleanup()
    mockHandler.mockClear()
    render(<BitControls onChangeBits={mockHandler} currentBitArray={['1','0','0','0','0','0','0','1','1']}/>)
    const addByte2 = screen.getByTestId('add-byte')
    fireEvent.click(addByte2)
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toReturnWith(['1','0','0','0','0','0','0','1','1','0','0','0','0','0','0','0'])
})

test('can see bits', () => {
    render(<BitControls onChangeBits={mockHandler} currentBitArray={['1','0','0','0']}/>)
    const bitCount = screen.getByTestId('bit-count')
    expect(bitCount).toHaveValue('4')
})

test('can remove byte', ()=>{
    render(<BitControls onChangeBits={mockHandler} currentBitArray={['1','0','0','0','0','0','0','1','1','0','0','0','0','0','0','0']}/>)
    const addByte = screen.getByTestId('remove-byte')
    fireEvent.click(addByte)
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toReturnWith(['1','0','0','0','0','0','0','1'])
})

test('can reset bits', ()=>{
    render(<BitControls onChangeBits={mockHandler} currentBitArray={['1','0','1','0','1']}/>)
    const resetBits = screen.getByTestId('reset-bits')
    fireEvent.click(resetBits)
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toReturnWith(['0','0','0','0','0'])
})

test('changing bitCount calls onChangeBitCount handler', async ()=>{
    render(<BitControls currentBitArray={['0','1']} onChangeBits={mockHandler}/>)
    const textbox = screen.getByTestId('bit-count');
    expect(textbox).toHaveValue('2')
    fireEvent.click(textbox);
    expect(textbox).toBeEnabled();
    userEvent.clear(textbox)    
    userEvent.type(textbox, '4');
    userEvent.tab()
    expect(mockHandler).toHaveBeenCalled()
    waitFor(()=>{
        expect(mockHandler).toBeCalledWith(['0','0','0','0'])
    })
})




