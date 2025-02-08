import { useState, useEffect, useRef } from "react";
import _, {isEqual} from 'lodash';
import Bit from "./Bit";
import "../css/BitInteraction.css";
import BitControls from "./BitControls";
import ValueControls from "./ValueControls";
import ByteControls from "./ByteControls";

interface BitInteractionProps {
    numberOfBits?: number,
    startingIntValue?: number,
}

const BitInteraction: React.FC<BitInteractionProps> = ({ numberOfBits = 8, startingIntValue = 0 }) => {
    const MAXBITS = 64
    const [bitCount, setBitCount] = useState(numberOfBits)
    const [intValue, setIntValue] = useState(startingIntValue)
    const [internalIntValue, setInternalIntValue] = useState(intValue)
    
    const chunkBitArray = (bits: string[]) => _.chunk(bits,8)
    
    const calculateChunkedBitArray = (value: number, useBitCount: number = bitCount): string[][] => {
        const binaryString = value.toString(2);
        const paddedBinaryString = binaryString.padStart(
            Math.ceil(binaryString.length / useBitCount) * useBitCount,
            "0"
        );
        return chunkBitArray(paddedBinaryString.split("").toReversed());
    }

    const [chunkedBitArray, setChunkedBitArray] = useState(calculateChunkedBitArray(startingIntValue, numberOfBits))

    // Update chunked bit array when intValue changes
    useEffect(() => {
        setChunkedBitArray((prevChunkedBitArray) => {
            const newChunkedBitArray = calculateChunkedBitArray(intValue)
            console.log(`new: ${newChunkedBitArray}, prev:${prevChunkedBitArray}`)
            if (_.isEqual(prevChunkedBitArray,newChunkedBitArray)) {
                return prevChunkedBitArray
            } else {
                setBitCount((prevBitCount) => {
                    const newBitCount = newChunkedBitArray.flat().length
                    return newBitCount === prevBitCount ? prevBitCount : newBitCount
                })
                return newChunkedBitArray
            }
        })
        setInternalIntValue(intValue)
    }, [intValue, bitCount])


    // // Update intValue and bitCount when chunkedBitArray changes
    useEffect(() => {
        console.log('modifying chunked bit array...')
        setBitCount((prevBitCount) => {
            const newBitCount = chunkedBitArray.flat().length
            return newBitCount === prevBitCount ? prevBitCount : newBitCount
        })

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
    }, [chunkedBitArray]);

    console.log(`bits as binary string = ${chunkedBitArray.flat().toReversed().join("")}`)

    const handleBitChange = (index: number) => {
        const updatedBits = [...chunkedBitArray.flat()]
        updatedBits[index] = (1 ^ Number(updatedBits[index])).toString(); // shifts bit between '0' or '1'
        setChunkedBitArray(_.chunk(updatedBits, 8))
    }

    const onChangeBits = (newFlatArray: string[]) => {
        setChunkedBitArray(chunkBitArray([...newFlatArray]))
    };

    const onChangeIntValue = (intValue: number) => {
        setIntValue(intValue)
    };

    const updateByte = (chunkIndex: number, bits: string[]):void => {
        console.log(chunkIndex, bits)
        setChunkedBitArray((prevChunkedBitArray) => {
            if (prevChunkedBitArray[chunkIndex] === bits)
                return prevChunkedBitArray

            const updatedChunkedBitArray = prevChunkedBitArray.map((chunk, index) => { 
                console.log(index, chunk, bits)
                if (index === chunkIndex)
                    return bits
                return chunk 
            })
            return updatedChunkedBitArray
        })
    }

    return (
        <div data-testid="bit-interaction" className="interaction">
            <div className="header">
                <h1>Binary Toy</h1>
                <p>An interactive tool for exploring binary numbers for education and fun</p>
            </div>
            <div className="container">
                <nav className="sidebar">
                    <BitControls
                        onChangeBits={onChangeBits}
                        currentBitArray={chunkedBitArray.flat()}
                        key={`bit-control-${chunkedBitArray.flat().join('')}`}
                    />
                </nav>
                <div className="main-content">
                    <ValueControls
                        currentIntValue={internalIntValue}
                        onChangeIntValue={onChangeIntValue}
                        key={`value-controls-${internalIntValue}`}
                    />
                    <div data-testid="bits" className="bit-container">
                        {chunkedBitArray.map((chunk, chunkIndex) => (
                            <div
                                key={"byte-" + chunkIndex}
                                className="byte"
                                data-testid="byte"
                                id={"byte-" + chunkIndex}
                            >
                                <ByteControls 
                                    key={`byte-controls-${chunkIndex}-start`} 
                                    byteNumber={chunkIndex} 
                                    bits={chunk} 
                                    onByteChange={updateByte} 
                                    position="start"
                                />                        
                                {chunk.map((bitVal, bitIndex) => (
                                    <>
                                        {bitIndex === 4 && <span className="spacer"></span>}
                                        <Bit
                                            key={`${chunkIndex}-${bitIndex}`}
                                            index={bitIndex + (chunkIndex * 8)}
                                            defaultValue={Number(bitVal)}
                                            onToggleBit={handleBitChange}
                                        />
                                    </>
                                ))}
                                <ByteControls 
                                    key={`byte-controls-${chunkIndex}-end`} 
                                    byteNumber={chunkIndex} 
                                    bits={chunk} 
                                    onByteChange={updateByte} 
                                    position="end"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BitInteraction
