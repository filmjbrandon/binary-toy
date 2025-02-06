var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { isEqual, size } from 'lodash';
import "../css/Controls.css";
var BitControls = function (_a) {
    var currentBitArray = _a.currentBitArray, onChangeBits = _a.onChangeBits;
    var MAXBITS = 64;
    var _b = useState(currentBitArray), bitArray = _b[0], setBitArray = _b[1];
    var _c = useState(size(bitArray)), bitCount = _c[0], setBitCount = _c[1];
    // useEffect(()=>{
    //     const newBitArray = calculateBitArray(intValue)
    //     setBitArray((prevBitArray) => {
    //         if (_.isEqual(prevBitArray, newBitArray)) 
    //             return prevBitArray
    //         onChangeBits(chunkBitArray(newBitArray))
    //         return newBitArray
    //     })
    // })
    var calculateBitArrayWithBitCountAdjustment = function (adjustedBitCount) {
        // count bit different
        var size = bitCount - adjustedBitCount;
        var newArray = __spreadArray([], bitArray, true);
        var result = size === 0
            ? bitArray
            : size < 0
                ? __spreadArray(__spreadArray([], newArray, true), new Array(Math.abs(size)).fill('0'), true) : newArray.slice(0, -adjustedBitCount);
        console.log("adjustedBitCount = ".concat(adjustedBitCount, ", result = ").concat(result));
        setBitCount(result.length);
        return result;
    };
    // const shiftBitsByChunk = (chunk: string[], direction: 'left' | 'right', steps: number = 1): string[] => {
    //     const length = chunk.length;
    //     const normalizedSteps = steps % length;
    //     if (direction === 'left') {
    //         return chunk.slice(normalizedSteps).concat(chunk.slice(0, normalizedSteps));
    //     } else if (direction === 'right') {
    //         return chunk.slice(-normalizedSteps).concat(chunk.slice(0, -normalizedSteps));
    //     }
    //     return chunk;
    // };
    // useEffect(()=>{
    // },[bitCount])
    var addBit = function (event) {
        if (bitCount >= MAXBITS)
            return;
        onChangeBits(__spreadArray(__spreadArray([], bitArray, true), ['0'], false));
    };
    var removeBit = function (event) {
        if (bitCount <= 1)
            return;
        // removing a bit requires removing last item from exist array of bits
        var updatedBits = __spreadArray([], bitArray, true);
        updatedBits.pop(); // removes last bit
        onChangeBits(updatedBits);
    };
    var handleBitCountChange = function (event) {
        var value = parseInt(event.target.value, 10); // Convert input to number
        var newBitCount = isNaN(value) ? 0 : value; // Fallback to 0 if input is invalid
        var newArray = calculateBitArrayWithBitCountAdjustment(newBitCount);
        console.log("newArray = ".concat(newArray));
        setBitArray(function (prevBitArray) {
            var result = isEqual(newArray, prevBitArray) ? prevBitArray : newArray;
            onChangeBits(result);
            return result;
        });
        // return newBitCount
    };
    var addByte = function (event) {
        if (bitCount >= MAXBITS)
            return;
        var bitsRemaining = 8 - (bitCount % 8);
        setBitArray(function (prevBitArray) {
            console.log("adding byte: prev array: ".concat(prevBitArray, ", bitsRemaining: ").concat(bitsRemaining));
            var newArray = calculateBitArrayWithBitCountAdjustment(bitCount + bitsRemaining);
            console.log("adding byte: new array: ".concat(newArray));
            if (isEqual(newArray, prevBitArray)) {
                console.log('array did not change');
                return prevBitArray;
            }
            console.log('array has changed...');
            onChangeBits(newArray);
            return newArray;
        });
    };
    var removeByte = function (event) {
        if (bitCount <= 8)
            return;
        var bitsToRemove = (bitCount % 8) || 8;
        // const updatedBits = [...bitArray]
        // for (let i=0; i<bitsToRemove; i++)
        //     updatedBits.pop() // removes bitsToRemove bits
        setBitArray(function (prevBitArray) {
            console.log("removing byte: prev array: ".concat(prevBitArray, ", bitsToRemove: ").concat(bitsToRemove));
            var newArray = calculateBitArrayWithBitCountAdjustment(bitsToRemove);
            console.log("removing byte: new array: ".concat(newArray));
            if (isEqual(newArray, prevBitArray)) {
                console.log('array did not change');
                return prevBitArray;
            }
            console.log('array has changed...');
            onChangeBits(newArray);
            return newArray;
        });
        // setChunkedBitArray(chunkBitArray(flattenedBitArray))
    };
    // const flipByte = (event: React.MouseEvent<HTMLButtonElement>): void => {
    //     const chunkIndex = Number(event.currentTarget.id.substring(10)); // Convert input to number
    //     setChunkedBitArray((prevChunkedBitArray) => {
    //         return prevChunkedBitArray.map((chunk, index) => {
    //             // If this is the target chunk, toggle all its bits
    //             if (index === chunkIndex) {
    //                 return chunk.map((bit) => (bit === '0' ? '1' : '0'));
    //             }
    //             // Otherwise, return the chunk as is
    //             return chunk;
    //         });
    //     });
    // }
    // const resetByte = (event: React.MouseEvent<HTMLButtonElement>): void => {
    //     const chunkIndex = Number(event.currentTarget.id.substring(11)); // Convert input to number
    //     setChunkedBitArray((prevChunkedBitArray) => {
    //         return prevChunkedBitArray.map((chunk, index) => {
    //             // If this is the target chunk, toggle all its bits
    //             if (index === chunkIndex) {
    //                 return chunk.map( (bit) => '0' );
    //             }
    //             // Otherwise, return the chunk as is
    //             return chunk;
    //         });
    //     });
    // }
    // const shiftByte = (event: React.MouseEvent<HTMLButtonElement>): void => {
    //     const chunkIndex = Number(event.currentTarget.id.substring(11)); // Convert input to number
    // //       (chunkIndex: number, direction: 'left' | 'right', steps: number = 1) => {
    //         setChunkedBitArray((prevChunkedBitArray) => {
    //         return prevChunkedBitArray.map((chunk, index) => {
    //             if (index === chunkIndex) {
    //                 return shiftBitsByChunk(chunk, 'left', 1);
    //             }
    //             return chunk;
    //         });
    //     });
    // };
    var resetBits = function () {
        var resetArray = Array(bitCount).fill('0');
        setBitArray(resetArray);
        onChangeBits(resetArray);
    };
    var bitControlsList = [
        {
            label: "Add Bit",
            testId: "add-bit",
            handler: addBit,
        },
        {
            label: "Remove Bit",
            testId: "remove-bit",
            handler: removeBit,
        },
        {
            label: "Reset Bits",
            testId: "reset-bits",
            handler: resetBits,
        },
        {
            label: "Add Byte",
            testId: "add-byte",
            handler: addByte,
        },
        {
            label: "Remove Byte",
            testId: "remove-byte",
            handler: removeByte,
        }
    ];
    return (_jsxs("div", { className: "control", id: "bit-controls", "data-testid": "bit-controls", children: [_jsx("label", { htmlFor: "bit-controls", children: "Controls" }), _jsxs("div", { className: "control-item", children: [_jsx("label", { htmlFor: "bit-count", children: "Bit Count" }), _jsx("input", { "data-testid": "bit-count", name: "bit-count", id: "bit-count", type: "text", defaultValue: bitCount, onBlur: handleBitCountChange })] }), bitControlsList.map(function (control, index) { return (_jsx("div", { className: "control-item", children: _jsx("button", { "data-testid": control.testId, onClick: control.handler, children: control.label }, "bit-control-".concat(control.testId, "-").concat(index)) })); })] }));
};
export default BitControls;
