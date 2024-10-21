import { useState } from "react";

import Bit from "./Bit";
import "./css/BitInteraction.css";

export default function BitInteraction({ numberOfBits = 2 }) {
    const [bitCount, setBitCount] = useState(numberOfBits);
    const [intValue, setIntValue] = useState(0);
    const [bits, setBits] = useState(Array(numberOfBits).fill(0));
    const [resetState, setResetState] = useState(false);

    const addBit = () => {
        setResetState(false);
        setBitCount(bitCount + 1);
        setBits([...bits, 0]);
    };

    const handleBitChange = (index:number, value:number) => {
        setResetState(false);
        console.log("Setting bit-%d to %d:", index, value);
        // const updatedBits = bits.map((b:number,i:number)=>{
        //     console.log("b,i",b,i);
        //     if (i === index)
        //         return value;
        //     else
        //         return b;
        // });
        console.log("bits",bits);
        const updatedBits = bits.map((bit,idx) => {
            if (idx === index) {
                bit=value;
                return bit;
            }
            return bit;
        });
        console.log("bits-reversed",updatedBits);
        setBits(updatedBits);
        setIntValue(Number.parseInt(updatedBits.toReversed().join(""),2));
        console.log("updated",updatedBits);
    };

    const handleIntChange = () => {
        console.log("setting bits to",intValue, intValue.toString(2).split(''))
        setBits(intValue.toString(2).split(''));
    }

    const resetBits = () => {
        setResetState(true);
        setBits(Array(numberOfBits).fill(0));
        setResetState(true);
        setIntValue(0);
    }

    return (
        <>
            <div data-testid="bit-interaction" className="interaction bits">
                {bits.map((v, i) => (
                    <Bit
                        key={i}
                        index={i}
                        setValue={v}
                        onChange={handleBitChange}
                        isReset={resetState}
                    />
                ))}
            </div>

            <div className="control">
                <input type="text" onChange={handleIntChange} id="number-value" value={intValue} />
                <button data-testid="add-bit" onClick={addBit}>Add Bit</button>
                <button data-testid="reset" onClick={resetBits}>Reset</button>
            </div>
        </>
    );
}
