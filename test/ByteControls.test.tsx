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

test('changing byteCount calls onByteChange handler', async ()=> {
    render(<ByteControls bits={['0','1']} onByteChange={mockHandler} />)
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




