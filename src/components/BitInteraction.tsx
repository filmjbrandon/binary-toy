import { useState, useEffect, useRef } from "react";
import _, { isEmpty } from 'lodash';
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
    const [hexValue, setHexValue] = useState('0x00')


    const calculateChunkedBitArray = (value: number, bitCount: number): string[][] => {
        const binaryString = value.toString(2);
        const paddedBinaryString = binaryString.padStart(
            Math.ceil(binaryString.length / bitCount) * bitCount,
            "0"
        );
        return _.chunk(paddedBinaryString.split("").toReversed(), 8);
    };

    const chunkBitArray = (bits: string[]) => _.chunk(bits,8)

    const [chunkedBitArray, setChunkedBitArray] = useState(calculateChunkedBitArray(startingIntValue, numberOfBits))
    const chunkedBitArrayRef = useRef(chunkedBitArray);
    const intValueRef = useRef(intValue)

    // Update chunked bit array when `intValue` changes
    useEffect(() => {
        if (intValue === intValueRef.current) return // ignore the initial update
        console.log("intValue or bitCount has changed")
        setChunkedBitArray(calculateChunkedBitArray(intValue, bitCount));
        console.log(`setting internalIntValue to: ${intValue}`)
        setInternalIntValue(intValue);
    }, [intValue, bitCount]);

    useEffect(() =>{
        if (chunkedBitArray === chunkedBitArrayRef.current) return // ignore the initial update
        console.log("chunkedBitsArray has changed")
        const numBytes = Math.ceil(bitCount / 8);
        const updatedBits = chunkedBitArray.flat()
        const newIntValue = (parseInt([...updatedBits].toReversed().join(""), 2) || 0)
        console.log(`newIntValue = ${newIntValue}`)
        setHexValue('0x' + newIntValue.toString(16).padStart(2*numBytes, '0').toUpperCase());
        setIntValue(newIntValue)       
    }, [chunkedBitArray])


    console.log(`bits as binary string = ${chunkedBitArray.flat().toReversed().join("")}`)


 
    const decrementValue = () => setIntValue(internalIntValue-1)
    const incrementValue = () => setIntValue(internalIntValue+1)

    const addBit = () => {
        setBitCount(bitCount + 1);
        console.log(`bitCount... ${bitCount}`)
        const bits = chunkedBitArray.flat()
        const updatedBits = [...bits, '0'];
        console.log(`bits within addBit function... ${updatedBits}`)
        const newChunkedArray = chunkBitArray(updatedBits)
        setChunkedBitArray(newChunkedArray);
    }

    //     // Increment the bit count
    //     setBitCount((prevBitCount) => prevBitCount + 1);
    
    //     // Update chunkedBitArray using the current value in the ref
    //     const currentBits = chunkedBitArrayRef.current.flat();
    //     const updatedBits = [...currentBits, "0"];
    //     const newChunkedArray = chunkBitArray(updatedBits, 8);

    //     setChunkedBitArray(newChunkedArray);
    //     return updatedBits.length
    // };

    const addByte = () => {
        const bitsRemaining = 8 - ( bitCount % 8 );
        const bits = chunkedBitArray.flat(); // Flatten the current chunked array
        setBitCount(bitCount+bitsRemaining);
        const newBits = [...bits].concat(Array(bitsRemaining).fill(0));
        setChunkedBitArray(chunkBitArray(newBits))
    }

    const removeByte = () => {
        const bitsRemaining = ( bitCount % 8 ) || 8;
        const bits = chunkedBitArray.flat(); // Flatten the current chunked array
        setBitCount(bitCount-bitsRemaining);
        const newBits = [...bits].toSpliced(Math.ceil(bitCount / 8),bitsRemaining);
        setChunkedBitArray(chunkBitArray(newBits))
    }

    const removeBit = () => {
        if (bitCount > 1) {
            const newBitCount = bitCount - 1
            setBitCount(newBitCount);
            const bits = chunkedBitArray.flat()
            const updatedBits = _.chunk([...bits].slice(0, newBitCount),8);
            setChunkedBitArray(updatedBits);
        }
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
                            defaultValue={bitCount}
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
                            defaultValue={hexValue}
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
                            defaultValue={internalIntValue.toString()}
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
                            defaultValue={String.fromCodePoint(internalIntValue)}
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
                            defaultValue={makeHexColor(internalIntValue)}
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
