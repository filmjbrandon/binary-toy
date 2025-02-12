import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { vi, expect, test, beforeEach, afterEach } from 'vitest'
import ValueControls from '../src/components/ValueControls';
import userEvent from '@testing-library/user-event';
import { random } from 'lodash';


const readValue = (value: number) => {
    return value
}
const mockHandler = vi.fn().mockImplementation(readValue)

beforeEach(async () => {
    mockHandler.mockClear()
})

afterEach(async () => {
  cleanup()
})

test('integer value display current integer value',()=>{
    render(<ValueControls currentIntValue={8}/>)
    const intValue = screen.getByTestId('int-value')
    expect(intValue).toHaveValue('8')
})

test('changing integer calls onChangeIntValue handler',()=>{
    render(<ValueControls onChangeIntValue={mockHandler} currentIntValue={8}/>)
    const textbox = screen.getByTestId('int-value');
    fireEvent.click(textbox);
    expect(textbox).toBeEnabled();
    userEvent.clear(textbox)    
    userEvent.type(textbox, '65');
    userEvent.tab()
    expect(textbox).toHaveValue('65');
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toBeCalledWith(65)
})

test('changing hex calls onChangeIntValue handler',async ()=>{
    render(<ValueControls onChangeIntValue={mockHandler} currentIntValue={8}/>)
    const textbox = screen.getByTestId('hex-value');
    fireEvent.click(textbox);
    expect(textbox).toBeEnabled();
    userEvent.clear(textbox)    
    userEvent.type(textbox, 'FF00');
    userEvent.tab()
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toBeCalledWith(65280)
})

test('hex value displays hexadecimal of current integer value', ()=>{
    render(<ValueControls currentIntValue={8}/>)
    let hexValue = screen.getByTestId('hex-value')
    expect(hexValue).toHaveValue('0x08')
    cleanup()
    render(<ValueControls currentIntValue={16}/>)
    hexValue = screen.getByTestId('hex-value')
    expect(hexValue).toHaveValue('0x10')
    cleanup()
    render(<ValueControls currentIntValue={255}/>)
    hexValue = screen.getByTestId('hex-value')
    expect(hexValue).toHaveValue('0xFF')
    cleanup()
    render(<ValueControls currentIntValue={65535}/>)
    hexValue = screen.getByTestId('hex-value')
    expect(hexValue).toHaveValue('0xFFFF')
})

test('can see character', () => {
    render(<ValueControls currentIntValue={65} />);
    let charValue = screen.getByTestId('char-value');
    expect(charValue).toHaveValue('A');
})

test('can display colors with 3 bytes', () => {
    render(<ValueControls currentIntValue={255}/>);
    let colorValue = screen.getByTestId('color-value');
    expect(colorValue).toHaveValue('#0000FF');    
    expect(colorValue).toHaveStyle('background-color: rgb(0, 0, 255)');    
})

test('displays text colors according to luminosity of background color', () => {
    render(<ValueControls currentIntValue={255}/>); // Full Blue
    const blueText = screen.getByTestId('color-value')
    expect(blueText).toHaveStyle('color: rgb(255, 255, 255)');
    cleanup()
    render(<ValueControls currentIntValue={16777215}/>); // Full White
    const whiteText = screen.getByTestId('color-value')
    expect(whiteText).toHaveStyle('color: rgb(0, 0, 0)');
})

test('hovering over a textbox will reveal full text', () => {
    render(<ValueControls currentIntValue={255} />);
    // cast to HTMLInputElement to avoid the error of not having "value" on HTMLElement
    const textboxes = screen.getAllByRole('textbox') as HTMLInputElement[];
    textboxes.forEach((box)=>{
        userEvent.hover(box);
        expect(box.title).toBe(box.value)
    });
});

test('select all content on click of an input', () => {
    render(<ValueControls currentIntValue={8} />)
    const controls = screen.getByTestId('value-controls')
    const textboxes = within(controls).getAllByRole('textbox');
    textboxes.forEach((item)=>{
        if (item.id.startsWith('value-control-')) {
            const text = (item as HTMLInputElement).value
            fireEvent.click(item)
            expect(item).toHaveSelection(text)
        }
    })
})

test('pressing enter will trigger update', async () => {
    render(<ValueControls currentIntValue={8}  onChangeIntValue={mockHandler}/>)
    const controls = screen.getByTestId('value-controls')
    const textboxes = within(controls).getAllByRole('textbox');
    textboxes.forEach((item)=>{
        if (item.id.startsWith('value-control-')) {
            let number = random(1,9);
            const text = (item as HTMLInputElement).value
            fireEvent.click(item)
            userEvent.type(item, (--number).toString())
            userEvent.type(item, '{enter}')
            expect(mockHandler).toBeCalledWith(number)
        }
    })
})

test('changing char calls onChangeIntValue', () => {
    render(<ValueControls onChangeIntValue={mockHandler} currentIntValue={8}/>)
    const textbox = screen.getByTestId('char-value');
    fireEvent.click(textbox);
    expect(textbox).toBeEnabled();
    userEvent.type(textbox, 'A');
    userEvent.tab()
    expect(mockHandler).toHaveBeenCalled()
    expect(mockHandler).toBeCalledWith(65)
})

