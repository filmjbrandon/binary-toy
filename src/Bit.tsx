import { useState } from "react";
import "./css/Bit.css";

export default function Bit({ index = 0, onChange = function (x: number, y: number) { }, setValue = 0, isReset = false }) {
    const [bitValue, setBitValue] = useState(setValue);
    const setBit = () => {
        const newBitValue = bitValue === 0 ? 1 : 0;
        setBitValue(newBitValue);
        onChange(index, newBitValue);
    };

    let result = {};
    if (isReset && bitValue === 1)
    {
        setBitValue(0);
        console.log("bitValue is beign reset to 0");
        result = (
                <div className="bit-container">
                <label
                    data-testid="bit-label" 
                    htmlFor="bit">
                    {index+1} (x{ index > 15 
                    ? Math.pow(2,index).toExponential(0) 
                    : Math.pow(2, index) })
                </label>
                <button
                    data-testid="bit"
                    id={"bit-" + index}
                    onClick={setBit}
                    className="bit"
                >
                    0
                </button>
           </div>
        );
    } 
    else if (isReset && setValue === 1) {
        console.log("setValue is beign used", setValue);
        setBitValue(1);

        result = (
            <div className="bit-container">
                <label
                    data-testid="bit-label" 
                    htmlFor="bit">
                    {index+1} (x{ index > 15 
                    ? Math.pow(2,index).toExponential(0) 
                    : Math.pow(2, index) })
                </label>
                <button
                    data-testid="bit"
                    id={"bit-" + index}
                    onClick={setBit}
                    className="bit"
                >
                1
                </button>
            </div>
        ) 
    }
    else {
    console.log("existing value is used", bitValue);

    result = (
        <div className="bit-container">
            <label
                data-testid="bit-label" 
                htmlFor="bit">
                {index+1} (x{ index > 15 
                ? Math.pow(2,index).toExponential(0) 
                : Math.pow(2, index) })
            </label>
            <button
                data-testid="bit"
                id={"bit-" + index}
                onClick={setBit}
                className="bit"
            >
                {bitValue}
            </button>
        </div>
    )};

    return result;
}


