import { useEffect, useRef, useState } from "react"
import _, {isEqual, repeat, size} from 'lodash'
import "../css/Controls.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'

interface BitControlsProperties {
    currentBitArray: string[],
    onChangeBits: (newFlatArray: string[]) => void,
}

const BitControls: React.FC<BitControlsProperties> = ({currentBitArray, onChangeBits}) => {

    const MAXBITS = 64
    const [bitArray, setBitArray] = useState(currentBitArray)
    const [bitCount, setBitCount] = useState(size(bitArray))
    
    // useEffect(()=>{
    //     const newBitArray = calculateBitArray(intValue)
    //     setBitArray((prevBitArray) => {
    //         if (_.isEqual(prevBitArray, newBitArray)) 
    //             return prevBitArray
    //         onChangeBits(chunkBitArray(newBitArray))
    //         return newBitArray
    //     })
    // })

    const calculateBitArrayWithBitCountAdjustment = (adjustedBitCount: number): string[] => {
        // count bit different
        const size = bitCount - adjustedBitCount
        const newArray = [...bitArray]
        const result = size === 0
            ? bitArray 
            : size < 0 
                ? [...newArray,...new Array(Math.abs(size)).fill('0')]
                : newArray.slice(0,-adjustedBitCount)
        console.log(`adjustedBitCount = ${adjustedBitCount}, result = ${result}`)
        setBitCount(result.length)
        return result
    }
    // const shiftBitsByChunk = (chunk: string[], direction: 'left' | 'right', steps: number = 1): string[] => {
    //     const length = chunk.length;
    //     const normalizedSteps = steps % length;

    //     if (direction === 'left') {
    //         return chunk.slice(normalizedSteps).concat(chunk.slice(0, normalizedSteps));
    //     } else if (direction === 'right') {
    //         return chunk.slice(-normalizedSteps).concat(chunk.slice(0, -normalizedSteps));
    //     }

    //     return chunk;
    // };

    // useEffect(()=>{
    // },[bitCount])
    
    const addBit = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (bitCount >= MAXBITS)
            return
        onChangeBits([...bitArray,'0'])
    }

    const removeBit = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (bitCount <= 1) 
            return
        // removing a bit requires removing last item from exist array of bits
        const updatedBits = [...bitArray]
        updatedBits.pop() // removes last bit
        onChangeBits(updatedBits)
    }

    const handleBitCountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = parseInt(event.target.value, 10); // Convert input to number
        const newBitCount = isNaN(value) ? 0 : value // Fallback to 0 if input is invalid
        const newArray = calculateBitArrayWithBitCountAdjustment(newBitCount)
        console.log(`newArray = ${newArray}`)
        setBitArray((prevBitArray)=>{
            const result = isEqual(newArray,prevBitArray) ? prevBitArray : newArray
            onChangeBits(result)
            return result
        })
            // return newBitCount
    }

    const addByte = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (bitCount >= MAXBITS)
            return
        const bitsRemaining = 8 - ( bitCount % 8 );
        setBitArray((prevBitArray)=>{
            console.log(`adding byte: prev array: ${prevBitArray}, bitsRemaining: ${bitsRemaining}`)
            const newArray = calculateBitArrayWithBitCountAdjustment(bitCount + bitsRemaining)
            console.log(`adding byte: new array: ${newArray}`)
            if (isEqual(newArray,prevBitArray)) {
                console.log('array did not change')
                return prevBitArray
            }
            console.log('array has changed...')
            onChangeBits(newArray)
            return newArray
        })
    }

    const removeByte = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (bitCount <= 8)
            return
        const bitsToRemove = ( bitCount % 8 ) || 8;
        // const updatedBits = [...bitArray]
        // for (let i=0; i<bitsToRemove; i++)
        //     updatedBits.pop() // removes bitsToRemove bits
        setBitArray((prevBitArray)=>{
            console.log(`removing byte: prev array: ${prevBitArray}, bitsToRemove: ${bitsToRemove}`)
            const newArray = calculateBitArrayWithBitCountAdjustment(bitsToRemove)
            console.log(`removing byte: new array: ${newArray}`)
            if (isEqual(newArray,prevBitArray)) {
                console.log('array did not change')
                return prevBitArray
            }
            console.log('array has changed...')
            onChangeBits(newArray)
            return newArray
        })
    }

    const resetBits = () => {
        const resetArray = Array(bitCount).fill('0')
        setBitArray(resetArray)
        onChangeBits(resetArray)
    }

    const bitControlsList = [
        {
            label: "Add Bit",
            testId: "add-bit",
            handler: addBit,
            icon: <FontAwesomeIcon icon={faPlus} size="2xl" color="mediumseagreen" />,
            disabled: () => bitCount >= MAXBITS,
            category: 'Bits',
        },
        {
            label: "Remove Bit",
            testId: "remove-bit",
            handler: removeBit,
            icon: <FontAwesomeIcon icon={faMinus} size="2xl" color="mediumseagreen" />,
            disabled: () => bitCount <= 1,
            category: 'Bits',
        },
        {
            label: "Reset Bits",
            testId: "reset-bits",
            handler: resetBits,
            icon: <FontAwesomeIcon icon={faRotateLeft} size="2xl" color="mediumseagreen" />,
            disabled: () => false,
            category: 'Reset',
        },
        {
            label: "Add Byte",
            testId: "add-byte",
            handler: addByte,
            icon: <FontAwesomeIcon icon={faPlus} size="2xl" color="mediumseagreen" />,
            disabled: () => bitCount >= MAXBITS,
            category: 'Bytes',
        },
        {
            label: "Remove Byte",
            testId: "remove-byte",
            handler: removeByte,
            icon: <FontAwesomeIcon icon={faMinus} size="2xl" color="mediumseagreen" />,
            disabled: () => bitCount <= 8,
            category: 'Bytes',
        }
    ]

    return (

        <div 
            className="control" 
            id="bit-controls"
            data-testid="bit-controls"
        >
            {bitControlsList.map((control, index) => (
                <div className="control-item">
                    <label htmlFor={`bit-control-${control.testId}-${index}`}>
                    {index-1 > -1 && bitControlsList[index-1].category === control.category
                        ? ''
                        : control.category
                    }
                    </label>
                    <button
                        key={`bit-control-${control.testId}-${index}`}
                        data-testid={control.testId}
                        aria-label={control.label}
                        disabled={control.disabled()}
                        onClick={control.handler}>
                        {control.icon}
                    </button>
                </div>
            ))}
            <div className="control-item">
                <label htmlFor="bit-count">
                    Bit Count
                </label>
                <input
                    data-testid="bit-count"
                    name="bit-count"
                    id="bit-count"
                    type="text"
                    defaultValue={bitCount}                 
                    onBlur={handleBitCountChange}   
                />

            </div>
        </div>
    )
}
export default BitControls

