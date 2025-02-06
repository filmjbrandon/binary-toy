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
import { useState, useEffect } from "react";
import _ from 'lodash';
import Bit from "./Bit";
import "../css/BitInteraction.css";
import BitControls from "./BitControls";
import ValueControls from "./ValueControls";
import ByteControls from "./ByteControls";
var BitInteraction = function (_a) {
    var _b = _a.numberOfBits, numberOfBits = _b === void 0 ? 8 : _b, _c = _a.startingIntValue, startingIntValue = _c === void 0 ? 0 : _c;
    var MAXBITS = 64;
    var _d = useState(numberOfBits), bitCount = _d[0], setBitCount = _d[1];
    var _e = useState(startingIntValue), intValue = _e[0], setIntValue = _e[1];
    var _f = useState(intValue), internalIntValue = _f[0], setInternalIntValue = _f[1];
    var chunkBitArray = function (bits) { return _.chunk(bits, 8); };
    var calculateChunkedBitArray = function (value, useBitCount) {
        if (useBitCount === void 0) { useBitCount = bitCount; }
        var binaryString = value.toString(2);
        var paddedBinaryString = binaryString.padStart(Math.ceil(binaryString.length / useBitCount) * useBitCount, "0");
        return chunkBitArray(paddedBinaryString.split("").toReversed());
    };
    var _g = useState(calculateChunkedBitArray(startingIntValue, numberOfBits)), chunkedBitArray = _g[0], setChunkedBitArray = _g[1];
    // Update chunked bit array when intValue changes
    useEffect(function () {
        setChunkedBitArray(function (prevChunkedBitArray) {
            var newChunkedBitArray = calculateChunkedBitArray(intValue);
            console.log("new: ".concat(newChunkedBitArray, ", prev:").concat(prevChunkedBitArray));
            if (_.isEqual(prevChunkedBitArray, newChunkedBitArray)) {
                return prevChunkedBitArray;
            }
            else {
                setBitCount(function (prevBitCount) {
                    var newBitCount = newChunkedBitArray.flat().length;
                    return newBitCount === prevBitCount ? prevBitCount : newBitCount;
                });
                return newChunkedBitArray;
            }
        });
        setInternalIntValue(intValue);
    }, [intValue, bitCount]);
    // // Update intValue and bitCount when chunkedBitArray changes
    useEffect(function () {
        console.log('modifying chunked bit array...');
        setBitCount(function (prevBitCount) {
            var newBitCount = chunkedBitArray.flat().length;
            return newBitCount === prevBitCount ? prevBitCount : newBitCount;
        });
        setIntValue(function (prevIntValue) {
            console.log("chunkedBitArray = ".concat(chunkedBitArray, ", prevIntValue = ").concat(prevIntValue, ", ").concat(bitCount));
            var updatedBits = chunkedBitArray.flat();
            console.log("updatedBits = ".concat(updatedBits, ", ").concat(bitCount));
            var newIntValue = parseInt(__spreadArray([], updatedBits, true).toReversed().join(""), 2);
            // Avoid redundant updates by checking if intValue actually changes
            if (newIntValue !== prevIntValue) {
                console.log("chunkedBitArray changed, updating intValue to ".concat(newIntValue));
                return newIntValue;
            }
            return prevIntValue; // No changes, keep the same
        });
    }, [chunkedBitArray]);
    console.log("bits as binary string = ".concat(chunkedBitArray.flat().toReversed().join("")));
    var handleBitChange = function (index) {
        var updatedBits = __spreadArray([], chunkedBitArray.flat(), true);
        updatedBits[index] = (1 ^ Number(updatedBits[index])).toString(); // shifts bit between '0' or '1'
        setChunkedBitArray(_.chunk(updatedBits, 8));
    };
    var onChangeBits = function (newFlatArray) {
        setChunkedBitArray(chunkBitArray(__spreadArray([], newFlatArray, true)));
    };
    var onChangeIntValue = function (intValue) {
        setIntValue(intValue);
    };
    var updateByte = function (chunkIndex, bits) {
        console.log(chunkIndex, bits);
        setChunkedBitArray(function (prevChunkedBitArray) {
            if (prevChunkedBitArray[chunkIndex] === bits)
                return prevChunkedBitArray;
            var updatedChunkedBitArray = prevChunkedBitArray.map(function (chunk, index) {
                console.log(index, chunk, bits);
                if (index === chunkIndex)
                    return bits;
                return chunk;
            });
            return updatedChunkedBitArray;
        });
    };
    return (_jsxs("div", { "data-testid": "bit-interaction", className: "interaction", children: [_jsx("div", { "data-testid": "bits", className: "bits", children: chunkedBitArray.map(function (chunk, chunkIndex) { return (_jsxs("div", { className: "byte", "data-testid": "byte", id: "byte-" + chunkIndex, children: [_jsx(ByteControls, { byteNumber: chunkIndex, bits: chunk, onByteChange: updateByte }, "byte-controls-".concat(chunkIndex)), chunk.map(function (bitVal, bitIndex) { return (_jsx(Bit, { index: bitIndex + (chunkIndex * 8), defaultValue: Number(bitVal), onToggleBit: handleBitChange }, "".concat(chunkIndex, "-").concat(bitIndex))); })] }, "byte-" + chunkIndex)); }) }), _jsx(BitControls, { onChangeBits: onChangeBits, currentBitArray: chunkedBitArray.flat() }, "bit-control-".concat(chunkedBitArray.flat().join(''))), _jsx(ValueControls, { currentIntValue: internalIntValue, onChangeIntValue: onChangeIntValue }, "value-controls-".concat(internalIntValue))] }));
};
export default BitInteraction;
