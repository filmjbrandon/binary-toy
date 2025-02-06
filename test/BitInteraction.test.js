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
import { fireEvent, render, screen, cleanup, waitFor } from '@testing-library/react';
import BitInteraction from '../src/components/BitInteraction';
import _ from 'lodash';
import userEvent from '@testing-library/user-event';
import { expect, test, afterEach } from 'vitest';
afterEach(function () {
    cleanup();
});
test('interaction defaults to 8 bits', function () {
    render(_jsx(BitInteraction, {}));
    var bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(8);
});
test('interaction can set # of bits', function () {
    render(_jsx(BitInteraction, { numberOfBits: 4 }));
    var bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(4);
    cleanup();
    render(_jsx(BitInteraction, { numberOfBits: 11 }));
    var bits2 = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits2).toHaveLength(11);
    cleanup();
});
test('bit is toggleable on click', function () {
    render(_jsx(BitInteraction, {}));
    var mostBit = screen.getByTestId('bit-7');
    expect(mostBit).toHaveTextContent('0');
    fireEvent.click(mostBit);
    expect(mostBit).toHaveTextContent('1');
    var leastBit = screen.getByTestId('bit-0');
    expect(leastBit).toHaveTextContent('0');
    fireEvent.click(leastBit);
    expect(leastBit).toHaveTextContent('1');
});
test('interaction has bit controls', function () {
    render(_jsx(BitInteraction, {}));
    var bitControls = screen.getByTestId('bit-controls');
    expect(bitControls).toBeInTheDocument();
});
test('interaction has value controls', function () {
    render(_jsx(BitInteraction, {}));
    var valueControls = screen.getByTestId('value-controls');
    expect(valueControls).toBeInTheDocument();
});
test('updating bits updates int value', function () { return __awaiter(void 0, void 0, void 0, function () {
    var leastBit, intValue, nextBit;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, {}));
        leastBit = screen.getByTestId('bit-0');
        intValue = screen.getByTestId('int-value');
        expect(intValue).toHaveValue('0');
        fireEvent.click(leastBit);
        expect(leastBit).toHaveTextContent('1');
        waitFor(function () {
            expect(intValue).toHaveValue('1');
        });
        nextBit = screen.getByTestId('bit-1');
        fireEvent.click(nextBit);
        waitFor(function () {
            expect(intValue).toHaveValue('3');
        });
        return [2 /*return*/];
    });
}); });
test('interaction generates hex value', function () {
    render(_jsx(BitInteraction, {}));
    var bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    var hexValue = screen.getByTestId('hex-value');
    fireEvent.click(bits[0]);
    waitFor(function () {
        expect(hexValue).toHaveValue('0x01');
    });
    fireEvent.click(bits[1]);
    waitFor(function () {
        expect(hexValue).toHaveValue('0x03');
    });
    fireEvent.click(bits[6]);
    fireEvent.click(bits[7]);
    waitFor(function () {
        expect(hexValue).toHaveValue('0xC3');
    });
});
test('can add bits', function () {
    render(_jsx(BitInteraction, { numberOfBits: 2 }));
    var bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(2);
    var button = screen.getByTestId('add-bit');
    expect(button).toHaveTextContent('Add Bit');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits).toHaveLength(3);
});
test('adding bits does not alter existing state', function () {
    console.log("starting with 2 bits");
    render(_jsx(BitInteraction, { startingIntValue: 10 }));
    var button = screen.getByTestId('add-bit');
    console.log("adding 1 bit");
    fireEvent.click(button);
    var intValue = screen.getByTestId('int-value');
    expect(intValue).toHaveValue('10');
    console.log("adding 1 bit");
    fireEvent.click(button);
    console.log("adding 1 bit");
    fireEvent.click(button);
    expect(intValue).toHaveValue('10');
    console.log("cleanup");
});
test('bit interaction can be loaded with a default value that is multiple of 8', function () {
    render(_jsx(BitInteraction, { startingIntValue: 24 }));
    var bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    var intValue = screen.getByTestId('int-value');
    expect(intValue).toHaveValue('24');
    expect(bits[0]).toHaveTextContent('0');
    expect(bits[1]).toHaveTextContent('0');
    expect(bits[2]).toHaveTextContent('0');
    expect(bits[3]).toHaveTextContent('1');
    expect(bits[4]).toHaveTextContent('1');
});
test('bit interaction can be loaded with a default value that is not a multiple of 8', function () {
    render(_jsx(BitInteraction, { startingIntValue: 23 }));
    var bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    var intValue = screen.getByTestId('int-value');
    expect(intValue).toHaveValue('23');
    expect(bits[0]).toHaveTextContent('1');
    expect(bits[1]).toHaveTextContent('1');
    expect(bits[2]).toHaveTextContent('1');
    expect(bits[3]).toHaveTextContent('0');
    expect(bits[4]).toHaveTextContent('1');
});
test('when int value is changed, hexValue is updated as well', function () {
    render(_jsx(BitInteraction, { startingIntValue: 10 }));
    var intValue = screen.getByTestId('int-value');
    var hexValue = screen.getByTestId('hex-value');
    expect(intValue).toHaveValue('10');
    expect(hexValue).toHaveValue('0x0A');
});
test('can reset interaction', function () { return __awaiter(void 0, void 0, void 0, function () {
    var bits, resetBits;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, { numberOfBits: 3 }));
        bits = screen.getAllByTestId(/^bit-[0-9]+/i);
        resetBits = screen.getByTestId('reset-bits');
        fireEvent.click(bits[0]);
        expect(bits[0]).toHaveTextContent('1');
        fireEvent.click(bits[1]);
        expect(bits[1]).toHaveTextContent('1');
        fireEvent.click(resetBits);
        waitFor(function () {
            expect(bits[0]).toHaveTextContent('0');
            expect(bits[1]).toHaveTextContent('0');
        });
        return [2 /*return*/];
    });
}); });
test('reset interaction clears display values', function () { return __awaiter(void 0, void 0, void 0, function () {
    var hexValue, intValue, button, bits;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, { numberOfBits: 2 }));
        hexValue = screen.getByTestId('hex-value');
        intValue = screen.getByTestId('int-value');
        button = screen.getByTestId('reset-bits');
        bits = screen.getAllByTestId(/^bit-[0-9]+/i);
        fireEvent.click(bits[1]);
        waitFor(function () {
            expect(intValue).toHaveValue('2');
            expect(hexValue).toHaveValue('0x02');
        });
        fireEvent.click(button);
        waitFor(function () {
            expect(bits[1]).toHaveTextContent('0');
            expect(intValue).toHaveValue('0');
            expect(hexValue).toHaveValue('0x00');
        });
        return [2 /*return*/];
    });
}); });
test('can remove bits', function () {
    render(_jsx(BitInteraction, { numberOfBits: 3 }));
    var bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(3);
    var button = screen.getByTestId('remove-bit');
    expect(button).toHaveTextContent('Remove Bit');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/i);
    expect(bits).toHaveLength(2);
});
test('removing bits changes bitCount', function () { return __awaiter(void 0, void 0, void 0, function () {
    var bitCount, removeBit;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, { numberOfBits: 3 }));
        bitCount = screen.getByTestId('bit-count');
        removeBit = screen.getByTestId('remove-bit');
        expect(bitCount).toHaveValue('3');
        fireEvent.click(removeBit);
        waitFor(function () {
            expect(bitCount).toHaveValue('2');
        });
        return [2 /*return*/];
    });
}); });
test('deleting a bit recalculates accurately', function () {
    render(_jsx(BitInteraction, { startingIntValue: 255 }));
    var removeBit = screen.getByTestId('remove-bit');
    var intValue = screen.getByTestId('int-value');
    expect(intValue).toHaveValue('255');
    var bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(8);
    expect(bits[7]).toHaveTextContent('1');
    expect(bits[6]).toHaveTextContent('1');
    expect(bits[5]).toHaveTextContent('1');
    expect(bits[4]).toHaveTextContent('1');
    expect(bits[3]).toHaveTextContent('1');
    expect(bits[2]).toHaveTextContent('1');
    expect(bits[1]).toHaveTextContent('1');
    expect(bits[0]).toHaveTextContent('1');
    fireEvent.click(removeBit);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    waitFor(function () {
        expect(intValue).toHaveValue('127');
        expect(bits[6]).toHaveTextContent('1');
        expect(bits[5]).toHaveTextContent('1');
        expect(bits[4]).toHaveTextContent('1');
        expect(bits[3]).toHaveTextContent('1');
        expect(bits[2]).toHaveTextContent('1');
        expect(bits[1]).toHaveTextContent('1');
        expect(bits[0]).toHaveTextContent('1');
        expect(bits.length).toBe(7);
    });
});
test('deleting a byte recalculates accurately', function () {
    render(_jsx(BitInteraction, { startingIntValue: 32896 }));
    var removeByte = screen.getByTestId('remove-byte');
    var intValue = screen.getByTestId('int-value');
    expect(intValue).toHaveValue('32896');
    var bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(16);
    expect(bits[15]).toHaveTextContent('1');
    expect(bits[14]).toHaveTextContent('0');
    expect(bits[7]).toHaveTextContent('1');
    expect(bits[6]).toHaveTextContent('0');
    fireEvent.click(removeByte);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    waitFor(function () {
        expect(intValue).toHaveValue('128');
        expect(bits.length).toBe(8);
        expect(bits[7]).toHaveTextContent('1');
        expect(bits[6]).toHaveTextContent('0');
    });
});
test('decrementing does not reduce bits', function () {
    render(_jsx(BitInteraction, { startingIntValue: 256, numberOfBits: 9 }));
    var bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits).toHaveLength(9);
    expect(bits[8]).toHaveTextContent('1');
    expect(bits[0]).toHaveTextContent('0');
    var decrement = screen.getAllByTestId('dec-value')[0];
    fireEvent.click(decrement);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits[0]).toHaveTextContent('1');
    expect(bits[8]).toHaveTextContent('0');
    expect(bits).toHaveLength(9);
});
test('incrementing may add a bit', function () { return __awaiter(void 0, void 0, void 0, function () {
    var bits, add, bitCount;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, { startingIntValue: 3, numberOfBits: 2 }));
        bits = screen.getAllByTestId(/^bit-[0-9]+/);
        expect(bits[0]).toHaveTextContent('1');
        expect(bits[1]).toHaveTextContent('1');
        add = screen.getAllByTestId('inc-value')[0];
        fireEvent.click(add);
        bits = screen.getAllByTestId(/^bit-[0-9]+/);
        bitCount = screen.getByTestId('bit-count');
        waitFor(function () {
            expect(bitCount).toHaveTextContent(bits.length.toString());
            expect(bits.length).toBe(3); // would become 0b100
            expect(bits[0]).toHaveTextContent('0');
            expect(bits[1]).toHaveTextContent('0');
            expect(bits[2]).toHaveTextContent('1');
        });
        return [2 /*return*/];
    });
}); });
test('incrementing may add a byte', function () { return __awaiter(void 0, void 0, void 0, function () {
    var bits, add, intValue;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, { startingIntValue: 255, numberOfBits: 8 }));
        bits = screen.getAllByTestId(/^bit-[0-9]+/);
        add = screen.getAllByTestId('inc-value')[0];
        intValue = screen.getByTestId('int-value');
        fireEvent.click(add);
        bits = screen.getAllByTestId(/^bit-[0-9]+/);
        waitFor(function () {
            expect(intValue).toHaveValue('256');
            expect(bits).toHaveLength(16);
        });
        cleanup();
        render(_jsx(BitInteraction, { startingIntValue: 65535, numberOfBits: 8 }));
        fireEvent.click(add);
        waitFor(function () {
            bits = screen.getAllByTestId(/^bit-[0-9]+/);
            expect(intValue).toHaveValue('65536');
            expect(bits).toHaveLength(24);
        });
        return [2 /*return*/];
    });
}); });
test('can see number of bits', function () { return __awaiter(void 0, void 0, void 0, function () {
    var textbox, button;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, { numberOfBits: 3 }));
        textbox = screen.getByTestId('bit-count');
        expect(textbox).toHaveValue('3');
        button = screen.getByTestId('add-bit');
        fireEvent.click(button);
        waitFor(function () {
            expect(textbox).toHaveValue('4');
        });
        button = screen.getByTestId('remove-bit');
        fireEvent.click(button);
        waitFor(function () {
            expect(textbox).toHaveValue('3');
        });
        return [2 /*return*/];
    });
}); });
test('can see bit #s', function () {
    render(_jsx(BitInteraction, {}));
    var labels = screen.getAllByTestId('bit-label');
    var bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(labels[0]).toHaveTextContent('0');
    expect(labels[7]).toHaveTextContent('7');
});
test('break new bytes onto new row', function () {
    render(_jsx(BitInteraction, { numberOfBits: 9 }));
    var bytes = screen.getAllByTestId('byte');
    expect(bytes[1]).toBeInTheDocument();
});
test('hex value should 0pad for each new byte', function () { return __awaiter(void 0, void 0, void 0, function () {
    var bits, result, button;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, { numberOfBits: 8 }));
        bits = screen.getAllByTestId(/^bit-[0-9]+/);
        result = screen.getByTestId('hex-value');
        fireEvent.click(bits[0]);
        waitFor(function () {
            expect(result).toHaveValue('0x01');
        });
        button = screen.getByTestId('add-bit');
        fireEvent.click(button);
        waitFor(function () {
            expect(result).toHaveValue('0x0001');
        });
        return [2 /*return*/];
    });
}); });
test('can add a byte at a time', function () {
    render(_jsx(BitInteraction, {}));
    var bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(8);
    var button = screen.getByTestId('add-byte');
    expect(button).toHaveTextContent('Add Byte');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(16);
});
test('can remove a byte at a time', function () {
    render(_jsx(BitInteraction, { numberOfBits: 15 }));
    var bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(15);
    var button = screen.getByTestId('remove-byte');
    expect(button).toHaveTextContent('Remove Byte');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(8);
});
test('can delete a bit after deleting a byte', function () {
    render(_jsx(BitInteraction, { numberOfBits: 9 }));
    var bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits).toHaveLength(9);
    var button = screen.getByTestId('remove-byte');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits.length).toBe(8);
    button = screen.getByTestId('remove-bit');
    expect(button).toHaveTextContent('Remove Bit');
    fireEvent.click(button);
    bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits).toHaveLength(7);
});
test('only display characters up to int 65535', function () {
    render(_jsx(BitInteraction, {}));
    var bytes = screen.getAllByTestId('byte');
    expect(bytes.length).toBe(1);
    var button = screen.getByTestId('add-byte');
    fireEvent.click(button);
    bytes = screen.getAllByTestId('byte');
    expect(bytes.length).toBe(2);
    var textbox = screen.getByTestId('char-value');
    expect(textbox).toBeInTheDocument();
    fireEvent.click(button);
    waitFor(function () {
        bytes = screen.getAllByTestId('byte');
        expect(bytes.length).toBe(3);
        expect(textbox).toBeEmptyDOMElement();
    });
});
test('can increment the integer value', function () { return __awaiter(void 0, void 0, void 0, function () {
    var bits, up, intVal;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, {}));
        bits = screen.getAllByTestId(/^bit-[0-9]+/);
        expect(bits.length).toBe(8);
        up = screen.getAllByTestId('inc-value')[0] // they all do same thing
        ;
        _.range(8).forEach(function (i) {
            fireEvent.click(bits[i]);
        });
        intVal = screen.getByTestId('int-value');
        expect(intVal).toHaveValue('255');
        fireEvent.click(up);
        bits = screen.getAllByTestId(/^bit-[0-9]+/);
        waitFor(function () {
            expect(intVal).toHaveValue('256');
        });
        return [2 /*return*/];
    });
}); });
test('can increment the hex value', function () { return __awaiter(void 0, void 0, void 0, function () {
    var bits, up, intVal;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, {}));
        bits = screen.getAllByTestId(/^bit-[0-9]+/);
        expect(bits.length).toBe(8);
        up = screen.getAllByTestId('inc-value')[0] // they all do same thing
        ;
        _.range(8).forEach(function (i) {
            fireEvent.click(bits[i]);
        });
        intVal = screen.getByTestId('hex-value');
        expect(intVal).toHaveValue('0xFF');
        fireEvent.click(up);
        bits = screen.getAllByTestId(/^bit-[0-9]+/);
        waitFor(function () {
            expect(intVal).toHaveValue('0x0100');
        });
        return [2 /*return*/];
    });
}); });
test('can decrement the integer value', function () { return __awaiter(void 0, void 0, void 0, function () {
    var down, intVal, bits;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, { numberOfBits: 9 }));
        down = screen.getAllByTestId('dec-value')[0] // they all do same thing 
        ;
        intVal = screen.getByTestId('int-value');
        bits = screen.getAllByTestId(/^bit-[0-9]+/);
        fireEvent.click(bits[8]);
        waitFor(function () {
            expect(intVal).toHaveValue('256');
            fireEvent.click(down);
            expect(intVal).toHaveValue('255');
        });
        return [2 /*return*/];
    });
}); });
test('can decrement the hex value', function () { return __awaiter(void 0, void 0, void 0, function () {
    var down, intVal, bits;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, { numberOfBits: 9 }));
        down = screen.getAllByTestId('dec-value')[0] // they all do same thing 
        ;
        intVal = screen.getByTestId('int-value');
        bits = screen.getAllByTestId(/^bit-[0-9]+/);
        fireEvent.click(bits[8]);
        waitFor(function () {
            expect(intVal).toHaveValue('0x100');
            fireEvent.click(down);
            expect(intVal).toHaveValue('0xFF');
        });
        return [2 /*return*/];
    });
}); });
test('can set bits from int value', function () { return __awaiter(void 0, void 0, void 0, function () {
    var textbox;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, {}));
        textbox = screen.getByTestId('int-value');
        fireEvent.click(textbox);
        expect(textbox).toBeEnabled();
        userEvent.type(textbox, '65');
        userEvent.tab();
        waitFor(function () {
            expect(textbox).toHaveValue('65');
            var bits = screen.getAllByTestId(/^bit-[0-9]+/);
            expect(bits).toHaveLength(8);
            expect(bits[0]).toHaveTextContent('1');
            expect(bits[1]).toHaveTextContent('0');
            expect(bits[2]).toHaveTextContent('0');
            expect(bits[3]).toHaveTextContent('0');
            expect(bits[4]).toHaveTextContent('0');
            expect(bits[5]).toHaveTextContent('1');
            expect(bits[6]).toHaveTextContent('0');
            expect(bits[7]).toHaveTextContent('0');
        });
        return [2 /*return*/];
    });
}); });
test('can set bit count from input', function () {
    render(_jsx(BitInteraction, {}));
    var textbox = screen.getByTestId('bit-count');
    expect(textbox).toHaveValue('8');
    fireEvent.click(textbox);
    expect(textbox).toBeEnabled();
    userEvent.clear(textbox);
    userEvent.type(textbox, '1');
    userEvent.type(textbox, '2');
    userEvent.tab();
    expect(textbox).toHaveValue('12');
    var bits = screen.getAllByTestId(/^bit-[0-9]+/);
    expect(bits).toHaveLength(12);
});
test('can set hex value from input', function () {
    render(_jsx(BitInteraction, {}));
    var textbox = screen.getByTestId('hex-value');
    fireEvent.click(textbox);
    expect(textbox).toBeEnabled();
    userEvent.type(textbox, '{backspace}');
    userEvent.type(textbox, 'FF');
    userEvent.tab();
    waitFor(function () {
        expect(textbox).toHaveValue('0xFF');
        var bits = screen.getAllByTestId(/^bit-[0-9]+/);
        expect(bits).toHaveLength(12);
    });
});
test('can flip all bits in a byte', function () { return __awaiter(void 0, void 0, void 0, function () {
    var flipAll, intValue;
    return __generator(this, function (_a) {
        render(_jsx(BitInteraction, { numberOfBits: 16 }));
        flipAll = screen.getAllByTestId('flip-byte');
        intValue = screen.getByTestId('int-value');
        fireEvent.click(flipAll[0]);
        fireEvent.click(flipAll[1]);
        waitFor(function () {
            expect(intValue).toHaveValue('65535');
        });
        return [2 /*return*/];
    });
}); });
test('can reset all bits in a byte', function () {
    render(_jsx(BitInteraction, { startingIntValue: 65535 }));
    var resetAll = screen.getAllByTestId('reset-byte');
    var intValue = screen.getByTestId('int-value');
    fireEvent.click(resetAll[0]);
    waitFor(function () {
        expect(intValue).toHaveValue('255');
    });
    fireEvent.click(resetAll[1]);
    waitFor(function () {
        expect(intValue).toHaveValue('0');
    });
});
