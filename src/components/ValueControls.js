import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import "../css/Controls.css";
var ValueControls = function (_a) {
    var currentIntValue = _a.currentIntValue, _b = _a.onChangeIntValue // default to 0 if no value provided, useful for testing
    , onChangeIntValue = _b === void 0 ? function () { return 0; } : _b // default to 0 if no value provided, useful for testing
    ;
    var MAXBITS = 64;
    var toHex = function (newIntValue) {
        var bitCount = Number(newIntValue).toString(2).length;
        var numBytes = Math.ceil(bitCount / 8);
        return '0x' + newIntValue.toString(16).padStart(2 * numBytes, '0').toUpperCase();
    };
    var _c = useState(currentIntValue), intValue = _c[0], setIntValue = _c[1];
    var _d = useState(toHex(intValue)), hexValue = _d[0], setHexValue = _d[1];
    var decrementValue = function () { return setIntValue(intValue - 1); };
    var incrementValue = function () { return setIntValue(intValue + 1); };
    var inputRef = useRef(null);
    useEffect(function () {
        setHexValue(function (prevHexValue) {
            var newHexValue = toHex(intValue);
            return prevHexValue === newHexValue ? prevHexValue : newHexValue;
        });
        onChangeIntValue(intValue);
    }, [intValue]);
    var handleIntChange = function (event) {
        var value = parseInt(event.target.value, 10); // Convert input to number
        setIntValue(isNaN(value) ? 0 : value); // Fallback to 0 if input is invalid
    };
    var handleHexChange = function (event) {
        setIntValue(parseInt(event.target.value, 16)); // convert hex to int
    };
    var makeHexColor = function (num) {
        return "#" +
            Number(num).toString(16)
                .padStart(6, '0')
                .slice(-6)
                .toUpperCase();
    };
    var getTextColor = function (backgroundColor) {
        // Helper to convert hex to RGB
        var hexToRgb = function (hex) {
            var bigint = parseInt(hex.slice(1), 16);
            var r = (bigint >> 16) & 255;
            var g = (bigint >> 8) & 255;
            var b = bigint & 255;
            return { r: r, g: g, b: b };
        };
        // Calculate luminance
        var calculateLuminance = function (_a) {
            var r = _a.r, g = _a.g, b = _a.b;
            var normalize = function (value) {
                value /= 255;
                return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
            };
            var rNorm = normalize(r);
            var gNorm = normalize(g);
            var bNorm = normalize(b);
            return 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
        };
        // Convert hex color to RGB
        var rgb = backgroundColor.startsWith("#")
            ? hexToRgb(backgroundColor)
            : { r: 0, g: 0, b: 0 }; // Fallback to black if invalid
        // Calculate the luminance
        var luminance = calculateLuminance(rgb);
        // Return white text for dark backgrounds and black text for light backgrounds
        return luminance > 0.5 ? "#000000" : "#FFFFFF";
    };
    var setColorValueStyles = function (num) {
        var styles = {
            backgroundColor: 'inherit',
            color: 'inherit',
        };
        if (num <= 16777215) {
            styles.backgroundColor = makeHexColor(num);
        }
        return styles;
    };
    var handleKeyDown = function (event) {
        var _a;
        if (event.key === "Return") {
            console.log("hello, world");
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur(); // Programmatically blur the input
        }
    };
    var valueControlsList = [
        {
            label: "Hex Value",
            testId: "hex-value",
            handler: handleHexChange,
            value: hexValue,
        },
        {
            label: "Integer Value",
            testId: "int-value",
            handler: handleIntChange,
            value: intValue,
        },
    ];
    var valueReadOnlyList = [
        {
            label: "Character",
            testId: "char-value",
            value: (intValue <= 1114112) ? String.fromCodePoint(intValue) : '[N/A]',
        },
        {
            label: "Color",
            testId: "color-value",
            value: makeHexColor(intValue),
            style: setColorValueStyles(intValue)
        },
    ];
    return (_jsxs("div", { className: "control", id: "value-controls", "data-testid": "value-controls", children: [valueControlsList.map(function (control, index) { return (_jsxs("div", { className: "value-control-item", children: [_jsx("label", { htmlFor: "value-control-".concat(index), children: control.label }), _jsxs("div", { className: "inc-dec", children: [_jsx("span", { hidden: intValue >= Math.pow(2, MAXBITS), "data-testid": "inc-value", onClick: incrementValue, className: "inc", children: String.fromCodePoint(0x25b2) }), _jsx("span", { hidden: intValue === 0, "data-testid": "dec-value", onClick: decrementValue, className: "dec", children: String.fromCodePoint(0x25bc) })] }), _jsx("input", { id: "value-control-".concat(control.testId, "-").concat(index), ref: inputRef, "data-testid": control.testId, name: control.testId, onBlur: control.handler, defaultValue: control.value.toString(), onKeyDown: handleKeyDown, title: control.value.toString() }, "value-control-".concat(control.testId, "-").concat(index))] })); }), valueReadOnlyList.map(function (control, index) { return (_jsxs("div", { className: "value-control-item", hidden: control.value === '[N/A]', children: [_jsx("label", { htmlFor: "value-control-".concat(index), children: control.label }), _jsx("input", { readOnly: true, id: "value-control-".concat(control.testId, "-").concat(index), "data-testid": control.testId, name: control.testId, value: control.value.toString(), title: control.value.toString(), style: control.style }, "value-control-".concat(control.testId, "-").concat(index))] })); })] }));
};
export default ValueControls;
