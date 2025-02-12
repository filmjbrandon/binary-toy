import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, vi, test, beforeEach, afterEach } from 'vitest'
import ByteControls from '../src/components/ByteControls';
import userEvent from '@testing-library/user-event';

const readBits = (chunkNumber: number, bits: string[]) => {
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

test('changing byteCount calls onByteChange handler', ()=> {
    render(<ByteControls bits={['0','1']} onByteChange={mockHandler}/>)
    let resetByte = screen.getByTestId('reset-byte');
    fireEvent.click(resetByte)
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toBeCalledTimes(1)
    expect(mockHandler).toBeCalledWith(0,['0','0'])
    cleanup()
    mockHandler.mockClear()
    render(<ByteControls bits={['0','1','1','0']} byteNumber={1} onByteChange={mockHandler} />)
    resetByte = screen.getByTestId('flip-byte');
    fireEvent.click(resetByte)
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toBeCalledTimes(1)
    expect(mockHandler).toBeCalledWith(1,['1','0','0','1'])
})

test('can shift bits left', ()=> {
    render(<ByteControls bits={['0','1','1','0']} byteNumber={1} onByteChange={mockHandler} />)
    const shiftLeft = screen.getByTestId('shift-bits-left');
    fireEvent.click(shiftLeft)
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toBeCalledTimes(1)
    expect(mockHandler).toBeCalledWith(1,['0','0','1','1'])
})

test('can shift bits right', ()=> {
    render(<ByteControls bits={['0','1','1','0']} byteNumber={1} onByteChange={mockHandler} />)
    const shiftLeft = screen.getByTestId('shift-bits-right');
    fireEvent.click(shiftLeft)
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toBeCalledTimes(1)
    expect(mockHandler).toBeCalledWith(1,['1','1','0','0'])
})

test('can shift bits right from end', ()=> {
    render(<ByteControls bits={['0','0','1','1']} byteNumber={1} onByteChange={mockHandler} />)
    const shiftLeft = screen.getByTestId('shift-bits-right');
    fireEvent.click(shiftLeft)
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toBeCalledTimes(1)
    expect(mockHandler).toBeCalledWith(1,['0','1','1','0'])
})


test('shifts bits right without overflow', () => {
    render(<ByteControls bits={['1','1','0','0']} byteNumber={1} onByteChange={mockHandler} config={{overflow: false}} />)
    const shiftRight = screen.getByTestId('shift-bits-right');
    fireEvent.click(shiftRight)
    expect(mockHandler).toHaveBeenCalledWith(1, ['1','0','0','0'])
})

test('shifts bits right with overflow', () => {
    render(<ByteControls bits={['1','1','0','0']} byteNumber={1} onByteChange={mockHandler} />)
    const shiftRight = screen.getByTestId('shift-bits-right');
    fireEvent.click(shiftRight)
    expect(mockHandler).toHaveBeenCalledWith(1, ['1','0','0','1'])
})

test('shifts bits left without overflow', async () => {
    render(<ByteControls bits={['1','0','1','1']} byteNumber={1} onByteChange={mockHandler} config={{overflow: false}}/>)
    const shiftLeft = screen.getByTestId('shift-bits-left');
    fireEvent.click(shiftLeft)
    expect(mockHandler).toHaveBeenCalledWith(1, ['0','1','0','1'])
})

test('overflow is false if provided empty config object', () => {
    render(<ByteControls bits={['1','0','1','1']} byteNumber={1} onByteChange={mockHandler} config={{}}/>)
    const shiftLeft = screen.getByTestId('shift-bits-left');
    fireEvent.click(shiftLeft)
    expect(mockHandler).toHaveBeenCalledWith(1, ['0','1','0','1'])
})


test('shifts bits left with overflow', async () => {
    render(<ByteControls bits={['1','0','1','1']} byteNumber={1} onByteChange={mockHandler} config={{overflow:true}} />)
    const shiftLeft = screen.getByTestId('shift-bits-left');
    fireEvent.click(shiftLeft)
    expect(mockHandler).toHaveBeenCalledWith(1, ['1','1','0','1'])
})

test('shifts bits right with overflow on all 1s', () => {
    render(<ByteControls bits={['1','1','1','1']} byteNumber={1} onByteChange={mockHandler} config={{overflow:true}} />)
    const shiftRight = screen.getByTestId('shift-bits-right');
    fireEvent.click(shiftRight)
    expect(mockHandler).toHaveBeenCalledWith(1, ['1','1','1','1'])
})

test('shifts bits left with overflow on all 1s', () => {
    render(<ByteControls bits={['1','1','1','1']} byteNumber={1} onByteChange={mockHandler} config={{overflow:true}} />)
    const shiftLeft = screen.getByTestId('shift-bits-left');
    fireEvent.click(shiftLeft)
    expect(mockHandler).toHaveBeenCalledWith(1, ['1','1','1','1'])
})

test('shifts bits right with overflow on alternating bits', () => {
    render(<ByteControls bits={['1','0','1','0']} byteNumber={1} onByteChange={mockHandler} config={{overflow:true}} />)
    const shiftRight = screen.getByTestId('shift-bits-right');
    fireEvent.click(shiftRight)
    expect(mockHandler).toHaveBeenCalledWith(1, ['0','1','0','1'])
})

test('clicking the byte-controls button opens the byte-controls menu', () => {
    render(<ByteControls bits={['1','1','1','1','1']} byteNumber={2} onByteChange={mockHandler} />)
    const byteControlsContainer = screen.getByTestId('byte-controls-container')
    const byteMenuButton = screen.getByTestId('byte-controls-button');
    expect(byteControlsContainer).not.toHaveClass('dropdown')
    fireEvent.click(byteMenuButton)
    expect(byteControlsContainer).toHaveClass('dropdown')
})

test('clicking anywhere closes the byte-controls menu', () => {
    render(<ByteControls bits={['1','1','1','1','1']} byteNumber={2} onByteChange={mockHandler} />)
    const byteControlsContainer = screen.getByTestId('byte-controls-container')
    const byteMenuButton = screen.getByTestId('byte-controls-menu');
    fireEvent.click(byteMenuButton)
    expect(byteControlsContainer).toBeVisible()
    fireEvent.click(byteMenuButton)
    expect(byteControlsContainer).not.toBeVisible()
})







