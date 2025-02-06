var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx } from "react/jsx-runtime";
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi, expect, test, beforeEach, afterEach } from 'vitest';
import ValueControls from '../src/components/ValueControls';
import userEvent from '@testing-library/user-event';
var readValue = function (value) {
    return value;
};
var mockHandler = vi.fn().mockImplementation(readValue);
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        mockHandler.mockClear();
        return [2 /*return*/];
    });
}); });
afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        cleanup();
        return [2 /*return*/];
    });
}); });
test('integer value display current integer value', function () {
    render(_jsx(ValueControls, { currentIntValue: 8 }));
    var intValue = screen.getByTestId('int-value');
    expect(intValue).toHaveValue('8');
});
test('changing integer calls onChangeIntValue handler', function () {
    render(_jsx(ValueControls, { onChangeIntValue: mockHandler, currentIntValue: 8 }));
    var textbox = screen.getByTestId('int-value');
    fireEvent.click(textbox);
    expect(textbox).toBeEnabled();
    userEvent.clear(textbox);
    userEvent.type(textbox, '65');
    userEvent.tab();
    expect(textbox).toHaveValue('65');
    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler).toBeCalledWith(65);
});
test('changing hex calls onChangeIntValue handler', function () { return __awaiter(void 0, void 0, void 0, function () {
    var textbox;
    return __generator(this, function (_a) {
        render(_jsx(ValueControls, { onChangeIntValue: mockHandler, currentIntValue: 8 }));
        textbox = screen.getByTestId('hex-value');
        fireEvent.click(textbox);
        expect(textbox).toBeEnabled();
        userEvent.clear(textbox);
        userEvent.type(textbox, 'FF00');
        userEvent.tab();
        expect(mockHandler).toHaveBeenCalled();
        expect(mockHandler).toBeCalledWith(65280);
        return [2 /*return*/];
    });
}); });
test('hex value displays hexadecimal of current integer value', function () {
    render(_jsx(ValueControls, { currentIntValue: 8 }));
    var hexValue = screen.getByTestId('hex-value');
    expect(hexValue).toHaveValue('0x08');
    cleanup();
    render(_jsx(ValueControls, { currentIntValue: 16 }));
    hexValue = screen.getByTestId('hex-value');
    expect(hexValue).toHaveValue('0x10');
    cleanup();
    render(_jsx(ValueControls, { currentIntValue: 255 }));
    hexValue = screen.getByTestId('hex-value');
    expect(hexValue).toHaveValue('0xFF');
    cleanup();
    render(_jsx(ValueControls, { currentIntValue: 65535 }));
    hexValue = screen.getByTestId('hex-value');
    expect(hexValue).toHaveValue('0xFFFF');
});
test('can see character', function () {
    render(_jsx(ValueControls, { currentIntValue: 65 }));
    var charValue = screen.getByTestId('char-value');
    expect(charValue).toHaveValue('A');
});
test('can display colors with 3 bytes', function () {
    render(_jsx(ValueControls, { currentIntValue: 255 }));
    var colorValue = screen.getByTestId('color-value');
    expect(colorValue).toHaveValue('#0000FF');
    expect(colorValue).toHaveStyle('background-color: rgb(0, 0, 255)');
});
test('displays text colors according to luminosity of background color', function () {
    render(_jsx(ValueControls, { currentIntValue: 255 })); // Full Blue
    var blueText = screen.getByTestId('color-value');
    expect(blueText).toHaveStyle('color: white');
    cleanup();
    render(_jsx(ValueControls, { currentIntValue: 16777215 })); // Full White
    var whiteText = screen.getByTestId('color-value');
    expect(whiteText).toHaveStyle('color: black');
});
test('hovering over a textbox will reveal full text', function () {
    render(_jsx(ValueControls, { currentIntValue: 255 }));
    // cast to HTMLInputElement to avoid the error of not having "value" on HTMLElement
    var textboxes = screen.getAllByRole('textbox');
    textboxes.forEach(function (box) {
        userEvent.hover(box);
        expect(box.title).toBe(box.value);
    });
});
