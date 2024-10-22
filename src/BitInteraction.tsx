import { useState } from "react";
import _, { isEmpty } from 'lodash';

import Bit from "./Bit";
import "./css/BitInteraction.css";

let counter = 0;

export default function BitInteraction({ numberOfBits = 8 }) {
    const [bitCount, setBitCount] = useState(numberOfBits);
    const [intValue, setIntValue] = useState(0);
    const [hexValue, setHexValue] = useState('0x00');
    const [bits, setBits] = useState(Array(numberOfBits).fill(0));
    const [resetState, setResetState] = useState(false);
    const [chunkedBitArray, setChunkedBitArray] = useState(_.chunk(Array(numberOfBits).fill(0),8));
    // const [editable, setEditable] = useState({'int-value':false});

    const decrementValue = () => {
        const i = intValue - 1;
        // setResetState(true);
        const newBits = Number(i).toString(2)
            .split('')
            .map(bit => {
                return Number.parseInt(bit);
            }).toReversed();
        resetBits(newBits); // this will set the bits for us
    }

    const incrementValue = () => {
        const i = intValue + 1;
        console.log("adding 1 to intValue: %d", intValue);
        const newBits = Number(i).toString(2)
            .split('')
            .map(bit => {
                return Number.parseInt(bit);
            }).toReversed();
        resetBits(newBits) // this will set the bits for us
    }
        

    const addBit = () => {
        setResetState(false);
        setBitCount(bitCount + 1);
        const newBits = [...bits, 0]
        // setBits(newBits);
        refreshDisplay(newBits);
    };

    const addByte = () => {
        setResetState(false);
        const bitsRemaining = 8 - ( bitCount % 8 );
        setBitCount(bitCount+bitsRemaining);
        const newBits = [...bits].concat(Array(bitsRemaining).fill(0));
        refreshDisplay(newBits);
    }

    const removeByte = () => {
        setResetState(false);
        const bitsRemaining = ( bitCount % 8 ) || 8;
        setBitCount(bitCount-bitsRemaining);
        const newBits = [...bits].toSpliced(Math.ceil(bitCount / 8),bitsRemaining);
        refreshDisplay(newBits);
    }

    const removeBit = () => {
        if (bitCount > 1) {
            const newBitCount = bitCount - 1;
            setBitCount(newBitCount);
            const updatedBits = [...bits].slice(0, newBitCount);
            refreshDisplay(updatedBits);
        }
    };

    const refreshDisplay = (arrayOfBits: Array<number>) => {
        setResetState(true);

        if (isEmpty(arrayOfBits)) {
            arrayOfBits = Array(bitCount).fill(0);
            console.log('resetting');
        } else {
            console.log('rebuilding');
        }
        setBits(arrayOfBits);
        // break bits into bytes 
        setChunkedBitArray( _.chunk(arrayOfBits, 8) );
        console.log("arrayOfBits", arrayOfBits);
        // we reverse the bit order before we write it to a string
        const iVal = parseInt(arrayOfBits.toReversed().join(""), 2);
        console.log("iVal", iVal);
        setIntValue(iVal);
        const numBytes = Math.ceil(arrayOfBits.length / 8);
        setHexValue('0x' + iVal.toString(16).padStart(2*numBytes, '0').toUpperCase());
        if (! arrayOfBits.every((v)=>v===0) )
            setResetState(false);

    }

    const handleBitChange = (index: number, value: number) => {
        setResetState(false);
        console.log("Setting bit-%d to %d:", index, value);
        const updatedBits = bits.map((bit, idx) => {
            if (idx === index) {
                bit = value;
                return bit;
            }
            return bit;
        });
        resetBits(updatedBits);
        refreshDisplay(updatedBits);
    };

    const handleIntChange = () => {
        console.log("setting bits to", intValue, intValue.toString(2).split(''))
        setBits(intValue.toString(2).split(''));
    }

    const resetBits = (newState:Array<number>) => {
        // if (isEmpty(newState))
        //     setResetState(true);
        // else if (! resetState )
        //     setResetState(true);

        refreshDisplay(newState);

    }

    const makeHexColor = (num:number) => {
        return "#"+
            Number(num).toString(16)
            .padStart(6, '0')
            .slice(-6)
            .toUpperCase();
    }

    // Print and increase the value
      console.log('Screen is refreshed ', ++counter, ' times')



    return (
        <div data-testid="bit-interaction" className="interaction">
            <div data-testid="bits" className="bits">

                {chunkedBitArray.map((chunk, k) => (
                    <div
                        key={"byte-" + k}
                        className="byte"
                        data-testid="byte"
                        id={"byte-" + k}>
                        {chunk.map((v, i) => (
                            <Bit
                                key={i + (k * 8)}
                                index={i + (k * 8)}
                                setValue={v}
                                onChange={handleBitChange}
                                isReset={resetState}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className="control" id="controls">
                <label htmlFor="controls">Controls</label>

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
                        onClick={(e) => resetBits([]) }>
                        Reset Bits
                    </button>
                    <button
                        data-testid="add-byte"
                        onClick={addByte}>
                        Add Byte
                    </button>
                    <button
                        data-testid="remove-byte"
                        onClick={removeByte}>
                        Remove Byte
                    </button>

                </div>

                <div className="display" id="controls-display">
                    <label htmlFor="controls-display">Display</label>

                    <div className="display-item">
                        <label htmlFor="bit-count">
                            # of Bits
                        </label>
                        <input type="text"
                            disabled={true}
                            id="bit-count"
                            data-testid="bit-count"
                            value={bitCount}
                            title={bitCount.toString()}
                        />
                    </div>

                    <div className="display-item">
                        <label htmlFor="hex-value">
                            HexVal
                        </label>
                        <input type="text"
                            disabled={true}
                            data-testid="hex-value"
                            id="hex-value"
                            value={hexValue}
                            title={hexValue}
                        />
                    </div>

                    <div className="display-item">
                        <label htmlFor="int-value">
                            IntVal
                        </label>
                        <input type="text"                            
                            id="int-value"
                            data-testid="int-value"
                            value={intValue.toString()}
                            title={intValue.toString()}
                            // onClick={ (e) => setEditable({'int-value':true}) }
                        />
                        {/* <button 
                            style={{ visibility: editable['int-value'] ? 'visible' : 'hidden' }} 
                            onClick={ (e) => console.log(e.target) }
                        >
                            Save Changes
                        </button> */}
                        <div className="inc-dec">
                            <span
                                data-testid="inc-value"
                                onClick={(e)=>incrementValue()} 
                                className="inc">{String.fromCodePoint(0x25b2)}</span>
                            <span 
                                data-testid="dec-value"
                                onClick={(e)=>decrementValue()} 
                                className="dec">{String.fromCodePoint(0x25bc)}</span>
                        </div>
 
                    </div>
                
                    {
                    (intValue <= 1114112) &&
                    <div className="display-item">
                        <label htmlFor="char-value">
                            Character
                        </label>
                        <input type="text"
                            disabled={true}
                            id="char-value"
                            data-testid="char-value"
                            value={String.fromCodePoint(intValue)}
                            title={String.fromCodePoint(intValue)}
                        />
                    </div>
                    }

                    {
                    // intValue <= 16777215 && 
                    <div className="display-item">
                        <label htmlFor="color-value">
                            Color
                        </label>
                        <input type="text"
                            disabled={true}
                            id="color-value"
                            data-testid="color-value"
                            value={makeHexColor(intValue)}
                            title={makeHexColor(intValue)}
                            style = {{ 
                                backgroundColor: (intValue <= 16777215) ? 
                                makeHexColor(intValue) :
                                    'inherit'
                            }}
                        />
                    </div>
                    }
                </div>

            </div>
        </div>
    );
}
