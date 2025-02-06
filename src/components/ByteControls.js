var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx } from "react/jsx-runtime";
import "../css/Controls.css";
var ByteControls = function (_a) {
    var bits = _a.bits, _b = _a.byteNumber, byteNumber = _b === void 0 ? 0 : _b, onByteChange = _a.onByteChange;
    var flipBits = function (event) {
        var updatedBits = __spreadArray([], bits, true);
        onByteChange(byteNumber, updatedBits.map(function (b) { return b === '0' ? '1' : '0'; }));
    };
    var resetBits = function (event) {
        var updatedBits = __spreadArray([], bits, true);
        onByteChange(byteNumber, updatedBits.map(function () { return '0'; }));
    };
    var byteControlsList = [
        {
            label: "Clear",
            testId: "reset-byte",
            handler: resetBits,
        },
        {
            label: "Flip",
            testId: "flip-byte",
            handler: flipBits,
        },
        // {
        //     label: "Left Shift Bits",
        //     testId: "shift-bits-left",
        //     handler: shiftBits,
        // },
        // {
        //     label: "Right Shift Bits",
        //     testId: "shift-bits-right",
        //     handler: shiftBits,
        // },
    ];
    return (_jsx("div", { className: "byte-controls", children: byteControlsList.map(function (control, index) { return (_jsx("button", { id: "".concat(control.testId, "-").concat(byteNumber), "data-testid": control.testId, onClick: control.handler, children: control.label })); }) }));
};
export default ByteControls;
