import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import "../css/Bit.css";
var Bit = function (_a) {
    var _b = _a.index, index = _b === void 0 ? 0 : _b, _c = _a.defaultValue, defaultValue = _c === void 0 ? 0 : _c, onToggleBit = _a.onToggleBit;
    var _d = useState(defaultValue), bitValue = _d[0], setBitValue = _d[1];
    var handleToggle = function () {
        if (!onToggleBit)
            setBitValue(Number(!bitValue));
        else
            onToggleBit(index);
    };
    return (_jsxs("div", { className: "bit-container code", children: [_jsx("label", { "data-testid": "bit-label", htmlFor: "bit-".concat(index), children: index }), _jsx("div", { onClick: handleToggle, "data-testid": "bit-".concat(index), id: "bit-".concat(index), className: "bit", children: onToggleBit ? defaultValue : bitValue })] }));
};
export default Bit;
