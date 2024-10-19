import React, { useState } from "react";
import "./css/Bit.css";

export default function Bit({ index = 0, onChange = function(x:number,y:number){} }) {
    const [bitValue, setBitValue] = useState(0);
    const setBit = () => {
        const newBitValue = bitValue === 0 ? 1 : 0;
        setBitValue(newBitValue);
        onChange(index, newBitValue);
    };
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
