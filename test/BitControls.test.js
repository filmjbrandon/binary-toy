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
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, vi, test, beforeEach, afterEach } from 'vitest';
import BitControls from '../src/components/BitControls';
import userEvent from '@testing-library/user-event';
var readBits = function (bits) {
    return bits;
};
var mockHandler = vi.fn().mockImplementation(readBits);
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        mockHandler.mockClear();
        return [2 /*return*/];
    });
}); });
afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        mockHandler.mockClear();
        cleanup();
        return [2 /*return*/];
    });
}); });
test('can add bit', function () {
    render(_jsx(BitControls, { onChangeBits: mockHandler, currentBitArray: ['0', '0', '0', '1'] }));
    var addBit = screen.getByTestId('add-bit');
    fireEvent.click(addBit);
    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler).toReturnWith(['0', '0', '0', '1', '0']);
    cleanup();
    mockHandler.mockClear();
    render(_jsx(BitControls, { onChangeBits: mockHandler, currentBitArray: ['0', '0', '0', '0', '0', '0', '0', '1'] }));
    var addBitChunk = screen.getByTestId('add-bit');
    fireEvent.click(addBitChunk);
    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler).toReturnWith(['0', '0', '0', '0', '0', '0', '0', '1', '0']);
});
test('can remove bit', function () {
    render(_jsx(BitControls, { onChangeBits: mockHandler, currentBitArray: ['1', '0', '0', '0'] }));
    var removeBit = screen.getByTestId('remove-bit');
    fireEvent.click(removeBit);
    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler).toReturnWith(['1', '0', '0']);
    cleanup();
    mockHandler.mockClear();
    render(_jsx(BitControls, { onChangeBits: mockHandler, currentBitArray: ['1', '0', '0', '0', '0', '0', '0', '1', '1'] }));
    var removeBit2 = screen.getByTestId('remove-bit');
    fireEvent.click(removeBit2);
    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler).toReturnWith(['1', '0', '0', '0', '0', '0', '0', '1']);
});
test('can add byte', function () {
    render(_jsx(BitControls, { onChangeBits: mockHandler, currentBitArray: ['1', '0', '0', '0'] }));
    var addByte = screen.getByTestId('add-byte');
    fireEvent.click(addByte);
    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler).toReturnWith(['1', '0', '0', '0', '0', '0', '0', '0']);
    cleanup();
    mockHandler.mockClear();
    render(_jsx(BitControls, { onChangeBits: mockHandler, currentBitArray: ['1', '0', '0', '0', '0', '0', '0', '1', '1'] }));
    var addByte2 = screen.getByTestId('add-byte');
    fireEvent.click(addByte2);
    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler).toReturnWith(['1', '0', '0', '0', '0', '0', '0', '1', '1', '0', '0', '0', '0', '0', '0', '0']);
});
test('can see bits', function () {
    render(_jsx(BitControls, { onChangeBits: mockHandler, currentBitArray: ['1', '0', '0', '0'] }));
    var bitCount = screen.getByTestId('bit-count');
    expect(bitCount).toHaveValue('4');
});
test('can remove byte', function () {
    render(_jsx(BitControls, { onChangeBits: mockHandler, currentBitArray: ['1', '0', '0', '0', '0', '0', '0', '1', '1', '0', '0', '0', '0', '0', '0', '0'] }));
    var addByte = screen.getByTestId('remove-byte');
    fireEvent.click(addByte);
    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler).toReturnWith(['1', '0', '0', '0', '0', '0', '0', '1']);
});
test('can reset bits', function () {
    render(_jsx(BitControls, { onChangeBits: mockHandler, currentBitArray: ['1', '0', '1', '0', '1'] }));
    var resetBits = screen.getByTestId('reset-bits');
    fireEvent.click(resetBits);
    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler).toReturnWith(['0', '0', '0', '0', '0']);
});
test('changing bitCount calls onChangeBitCount handler', function () { return __awaiter(void 0, void 0, void 0, function () {
    var textbox;
    return __generator(this, function (_a) {
        render(_jsx(BitControls, { currentBitArray: ['0', '1'], onChangeBits: mockHandler }));
        textbox = screen.getByTestId('bit-count');
        expect(textbox).toHaveValue('2');
        fireEvent.click(textbox);
        expect(textbox).toBeEnabled();
        userEvent.clear(textbox);
        userEvent.type(textbox, '4');
        userEvent.tab();
        expect(mockHandler).toHaveBeenCalled();
        waitFor(function () {
            expect(mockHandler).toBeCalledWith(['0', '0', '0', '0']);
        });
        return [2 /*return*/];
    });
}); });
