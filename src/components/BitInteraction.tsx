import { useState, useEffect, useRef } from "react";
import _, {isEqual} from 'lodash';
import Bit from "./Bit";
import "../css/BitInteraction.css";

interface BitInteractionProps {
    numberOfBits?: number,
    startingIntValue?: number,
}

const BitInteraction: React.FC<BitInteractionProps> = ({ numberOfBits = 8, startingIntValue = 0 }) => {
    const [bitCount, setBitCount] = useState(numberOfBits)
    const [intValue, setIntValue] = useState(startingIntValue)
    const [internalIntValue, setInternalIntValue] = useState(intValue)

    const toHex = (newIntValue:number): string => {
        const numBytes = Math.ceil(bitCount / 8);
        return '0x' + newIntValue.toString(16).padStart(2*numBytes, '0').toUpperCase()
    }
    
    const [hexValue, setHexValue] = useState(toHex(intValue))
    const chunkBitArray = (bits: string[]) => _.chunk(bits,8)
    
    const calculateChunkedBitArray = (value: number, useBitCount: number = bitCount): string[][] => {
        const binaryString = value.toString(2);
        const bitsRemaining = useBitCount
        const paddedBinaryString = binaryString.padStart(
            Math.ceil(binaryString.length / bitsRemaining) * bitsRemaining,
            "0"
        );
        return chunkBitArray(paddedBinaryString.split("").toReversed());
    }

    const [chunkedBitArray, setChunkedBitArray] = useState(calculateChunkedBitArray(startingIntValue, numberOfBits))
    const chunkedBitArrayRef = useRef(chunkedBitArray);
    const intValueRef = useRef(intValue)

    // Update chunked bit array when intValue changes
    useEffect(() => {
        setChunkedBitArray((prevChunkedBitArray) => {
            const newChunkedBitArray = calculateChunkedBitArray(intValue, bitCount)
            console.log(`new: ${newChunkedBitArray}, prev:${prevChunkedBitArray}`)
            if (_.isEqual(prevChunkedBitArray,newChunkedBitArray)) {
                return prevChunkedBitArray
            } else {
                return newChunkedBitArray
            }
        })
        setInternalIntValue(intValue)
        setHexValue(toHex(intValue))
    }, [intValue, bitCount])


    // Update intValue when chunkedBitArray changes
    useEffect(() => {
        setIntValue((prevIntValue) => {
            console.log(`chunkedBitArray = ${chunkedBitArray}, prevIntValue = ${prevIntValue}, ${bitCount}`)
            const updatedBits = chunkedBitArray.flat()
            console.log(`updatedBits = ${updatedBits}, ${bitCount}`)
            const newIntValue = parseInt([...updatedBits].toReversed().join(""), 2)
        
            // Avoid redundant updates by checking if intValue actually changes
            if (newIntValue !== prevIntValue) {
                console.log(`chunkedBitArray changed, updating intValue to ${newIntValue}`);
                return newIntValue;
            }
            return prevIntValue; // No changes, keep the same
        });
    }, [chunkedBitArray, bitCount]);

    console.log(`bits as binary string = ${chunkedBitArray.flat().toReversed().join("")}`)

 
    const decrementValue = () => setIntValue(internalIntValue-1)
    const incrementValue = () => setIntValue(internalIntValue+1)

    const addBit = () => {
        setBitCount((prevBitCount) => prevBitCount + 1)
    }

    const removeBit = () => {
        if (bitCount > 1) {
            setBitCount(bitCount - 1)
        }
    }

    const addByte = () => {
        const bitsRemaining = 8 - ( bitCount % 8 );
        setBitCount((prevBitCount) => prevBitCount + bitsRemaining)
    }

    const removeByte = () => {
        const bitsRemaining = ( bitCount % 8 ) || 8;
        setBitCount((prevBitCount) => prevBitCount - bitsRemaining) ;
    }

    const handleBitChange = (index: number) => {
        const updatedBits = [...chunkedBitArray.flat()]
        updatedBits[index] = (1 ^ Number(updatedBits[index])).toString(); // shifts bit between '0' or '1'
        const byteArray = _.chunk(updatedBits, 8); // 
        setChunkedBitArray(byteArray)
    }

    const handleIntChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = parseInt(event.target.value, 10); // Convert input to number
        setIntValue(isNaN(value) ? 0 : value); // Fallback to 0 if input is invalid
    }

    const resetBits = () => {
        const bitArray = Array(bitCount).fill('0')
        setChunkedBitArray(chunkBitArray(bitArray))
        setIntValue(0)
    }

    const makeHexColor = (num:number) => {
        return "#"+
            Number(num).toString(16)
            .padStart(6, '0')
            .slice(-6)
            .toUpperCase();
    }

    return (
        <div data-testid="bit-interaction" className="interaction">
            <div data-testid="bits" className="bits">

                {chunkedBitArray.map((chunk, chunkIndex) => (
                    <div
                        key={"byte-" + chunkIndex}
                        className="byte"
                        data-testid="byte"
                        id={"byte-" + chunkIndex}>
                        {chunk.map((bitVal, bitIndex) => (
                            <Bit
                                key={`${chunkIndex}-${bitIndex}`}
                                index={bitIndex + (chunkIndex * 8)}
                                defaultValue={Number(bitVal)}
                                onToggleBit={handleBitChange}
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
                        hidden={bitCount < 2}
                        data-testid="remove-bit"
                        onClick={removeBit}>
                        Remove Bit
                    </button>
                    <button data-testid="reset"
                        onClick={resetBits}>
                        Reset Bits
                    </button>
                    <button
                        data-testid="add-byte"
                        onClick={addByte}>
                        Add Byte
                    </button>
                    <button
                        hidden={bitCount < 9}
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
                            value={internalIntValue.toString()}
                            title={internalIntValue.toString()}
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
                    (internalIntValue <= 1114112) &&
                    <div className="display-item">
                        <label htmlFor="char-value">
                            Character
                        </label>
                        <input type="text"
                            disabled={true}
                            id="char-value"
                            data-testid="char-value"
                            value={String.fromCodePoint(internalIntValue)}
                            title={String.fromCodePoint(internalIntValue)}
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
                            value={makeHexColor(internalIntValue)}
                            title={makeHexColor(internalIntValue)}
                            style = {{ 
                                backgroundColor: (internalIntValue <= 16777215) ? 
                                makeHexColor(internalIntValue) :
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
export default BitInteraction
