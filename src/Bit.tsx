import { useState } from "react";
import "./css/Bit.css";

export default function Bit({ index = 0, onChange = function (x: number, y: number) { }, setValue = 0, isReset = false }) {
    const [bitValue, setBitValue] = useState(setValue);
    const setBit = () => {
        const newBitValue = bitValue === 0 ? 1 : 0;
        setBitValue(newBitValue);
        onChange(index, newBitValue);
    };
    if (isReset && bitValue === 1)
    {
        setBitValue(0);
        return (
            <button
                data-testid="bit"
                id={"bit-" + index}
                onClick={setBit}
                className="bit"
            >
                0
            </button>
        );
    } else
    return (
        <button
            data-testid="bit"
            id={"bit-" + index}
            onClick={setBit}
            className="bit"
        >
            {bitValue}
        </button>
    );
}
