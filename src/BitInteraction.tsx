import { useState } from "react";

import Bit from "./Bit";
import "./css/BitInteraction.css";

export default function BitInteraction({ numberOfBits = 8 }) {
    const [bitCount, setBitCount] = useState(numberOfBits);
    const [intValue, setIntValue] = useState(0);
    const [hexValue, setHexValue] = useState('0x00');
    const [bits, setBits] = useState(Array(numberOfBits).fill(0));
    const [resetState, setResetState] = useState(false);

    const addBit = () => {
        setResetState(false);
        setBitCount(bitCount + 1);
        setBits([...bits, 0]);
    };

    const removeBit = () => {
        if (bitCount > 1) {
            const newBitCount = bitCount - 1;
            setBitCount(newBitCount);
            const updatedBits = bits.slice(0,newBitCount);
            setBits(updatedBits);
            displayValues(updatedBits);
        }
    };
    
    const displayValues = (arrayOfBits:Array<number>) => {
        const iVal = parseInt(arrayOfBits.toReversed().join(""),2);
        setIntValue(iVal);
        setHexValue('0x'+iVal.toString(16).padStart(2,'0').toUpperCase());
    }

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
        displayValues(updatedBits);
        console.log("updated",updatedBits);
    };

    const handleIntChange = () => {
        console.log("setting bits to",intValue, intValue.toString(2).split(''))
        setBits(intValue.toString(2).split(''));
    }

    const resetBits = () => {
        setResetState(true);
        setBits(Array(bitCount).fill(0));
        setIntValue(0);
        setHexValue('0x00');
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

                <div className="display">

                    <div>
                    <label htmlFor="hex-value">
                        HexVal
                    </label>
                    <input type="text"  
                        disabled={true}
                        data-testid="hex-value"
                        id="hex-value" 
                        value={hexValue} 
                    />
                    </div>

                    <div>
                    <label htmlFor="int-value">
                        IntVal
                    </label>
                    <input type="text" 
                        disabled={true}
                        id="int-value" 
                        data-testid="int-value"
                        value={intValue} 
                    />
                    <label htmlFor="bit-count">
                        # of Bits
                    </label>
                    <input type="text" 
                        disabled={true}
                        id="bit-count" 
                        data-testid="bit-count"
                        value={bitCount} 
                    />

                    <label htmlFor="char">
                       Character
                    </label>
                    <input type="text" 
                        disabled={true}
                        id="char" 
                        data-testid="char"
                        value={String.fromCharCode(intValue)} 
                    />

                    </div>
                </div>

                <div className="buttons">

                    <button 
                        data-testid="add-bit" 
                        onClick={addBit}>
                        Add Bit
                    </button>
                    <button
                        disabled={bitCount < 2} 
                        data-testid="remove-bit" 
                        onClick={removeBit}>
                        Remove Bit
                    </button>
                    <button data-testid="reset" 
                        onClick={resetBits}>
                        Reset Bits
                    </button>
                </div>
            </div>
        </>
    );
}
