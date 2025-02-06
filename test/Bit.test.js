import { jsx as _jsx } from "react/jsx-runtime";
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Bit from '../src/components/Bit';
import { expect, test, afterEach } from 'vitest';
afterEach(function () {
    cleanup();
});
test('renders a bit', function () {
    render(_jsx(Bit, {}));
    var bit = screen.getByTestId('bit-0');
    expect(bit).toHaveTextContent('0');
    expect(bit).toHaveClass('bit');
});
test('Bit ID can be set using index', function () {
    render(_jsx(Bit, { index: 1 }));
    var bit = screen.getByTestId('bit-1');
    expect(bit).toHaveAttribute('id', 'bit-1');
});
test('can set value for a bit', function () {
    render(_jsx(Bit, { defaultValue: 1 }));
    var bit = screen.getByTestId('bit-0');
    expect(bit).toHaveTextContent('1');
    cleanup();
    render(_jsx(Bit, { defaultValue: 0 }));
    var bit2 = screen.getByTestId('bit-0');
    expect(bit2).toHaveTextContent('0');
    cleanup();
});
test('displays bit number', function () {
    render(_jsx(Bit, { index: 7 }));
    var label = screen.getByTestId('bit-label');
    expect(label).toHaveTextContent('7');
});
test('by default bit can be toggled', function () {
    render(_jsx(Bit, {}));
    var bit = screen.getByTestId('bit-0');
    expect(bit).toHaveTextContent('0');
    fireEvent.click(bit);
    expect(bit).toHaveTextContent('1');
    fireEvent.click(bit);
    expect(bit).toHaveTextContent('0');
});
