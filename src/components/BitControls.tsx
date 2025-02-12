import { useEffect, useRef, useState } from "react"
import _, {isEqual, repeat, size} from 'lodash'
import '../css/BitControls.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'

interface BitControlsProperties {
    currentBitArray: string[],
    onChangeBits: (newFlatArray: string[]) => void,
}

const BitControls: React.FC<BitControlsProperties> = ({currentBitArray, onChangeBits}) => {

    console.debug("loading BitControls");
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

    const calculateBitArrayWithBitCountAdjustment = (adjustedBitCount: number, settingBitCount: boolean = false): string[] => {
        console.debug(`calculateBitArrayWithBitCountAdjustment: adjustedBitCount = ${adjustedBitCount}, bitCount = ${bitCount}`)
        let difference = bitCount - adjustedBitCount // difference is negative if adding bits, and positive if removing
        console.debug(`calculateBitArrayWithBitCountAdjustment: adjustByBits = ${difference}`)
        const newArray = [...bitArray] // copy of bitArray
        if (settingBitCount && difference > 0) {
            const newBits = newArray.slice(0,-(difference))
            setBitCount(newBits.length)
            return newBits
        }

        const result = difference === 0
            ? bitArray 
            : difference < 0 
                ? [...newArray,...new Array(Math.abs(difference)).fill('0')] // append the adjustByBits # of bits to existing array
                : newArray.slice(0,-adjustedBitCount) // remove adjusted amount of bits from existing array
        console.debug(`calculateBitArrayWithBitCountAdjustment: result = ${result}`)
        setBitCount(result.length)
        return result
    }
    
    const addBit = (event: React.MouseEvent<HTMLButtonElement>|React.MouseEvent<HTMLDivElement>) => {
        if (bitCount >= MAXBITS)
            return
        onChangeBits([...bitArray,'0'])
    }

    const removeBit = (event: React.MouseEvent<HTMLButtonElement>|React.MouseEvent<HTMLDivElement>) => {
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
        const newArray = calculateBitArrayWithBitCountAdjustment(newBitCount, true)
        console.debug(`handleBitCountChange: newArray = ${newArray}`)
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
            console.debug(`addByte: adding byte: prev array: ${prevBitArray}, bitsRemaining: ${bitsRemaining}`)
            const newArray = calculateBitArrayWithBitCountAdjustment(bitCount + bitsRemaining)
            console.debug(`addByte: 0adding byte: new array: ${newArray}`)
            if (isEqual(newArray,prevBitArray)) {
                console.debug('addByte: array did not change')
                return prevBitArray
            }
            console.debug('addByte: array has changed...')
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
            console.debug(`removeByte: removing byte: prev array: ${prevBitArray}, bitsToRemove: ${bitsToRemove}`)
            const newArray = calculateBitArrayWithBitCountAdjustment(bitsToRemove)
            console.debug(`removeByte: removing byte: new array: ${newArray}`)
            if (isEqual(newArray,prevBitArray)) {
                console.debug('removeByte: array did not change')
                return prevBitArray
            }
            console.debug('removeByte: array has changed...')
            onChangeBits(newArray)
            return newArray
        })
    }

    const resetBits = () => {
        const resetArray = Array(bitCount).fill('0')
        setBitArray(resetArray)
        onChangeBits(resetArray)
    }

    const selectInputContents = (event: React.MouseEvent<HTMLInputElement>): void => {
        const input = event.target as HTMLInputElement
        input.focus()
        input.select()
    }

    const changeOnEnter = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        const input = event.target as HTMLInputElement
        if (event.key === 'Enter') {
            console.debug(`changeOnEnter: Enter pressed on event`)
            handleBitCountChange({ target: event.target } as React.ChangeEvent<HTMLInputElement>);
        }
    }

    const bitControlsList = [
        {
            label: "Add Bit",
            testId: "add-bit",
            handler: addBit,
            icon: <FontAwesomeIcon key="AddBitIcon" icon={faPlus} size="1x" />, /* using 1em height/width here ensures we can use font-size to scale */
            disabled: () => bitCount >= MAXBITS,
            category: 'Bits',
        },
        {
            label: "Remove Bit",
            testId: "remove-bit",
            handler: removeBit,
            icon: <FontAwesomeIcon key="RemoveBitIcon" icon={faMinus} size="1x" />, /* using 1em height/width here ensures we can use font-size to scale */
            disabled: () => bitCount <= 1,
            category: 'Bits',
        },
        {
            label: "Reset Bits",
            testId: "reset-bits",
            handler: resetBits,
            icon: <FontAwesomeIcon key="ResetBitsIcon" icon={faRotateLeft} size="1x" />, /* using 1em height/width here ensures we can use font-size to scale */
            disabled: () => false,
            category: 'Reset',
        },
        {
            label: "Add Byte",
            testId: "add-byte",
            handler: addByte,
            icon: <FontAwesomeIcon key="AddByteIcon" icon={faPlus} size="1x"  />, /* using 1em height/width here ensures we can use font-size to scale */
            disabled: () => bitCount >= MAXBITS,
            category: 'Bytes',
        },
        {
            label: "Remove Byte",
            testId: "remove-byte",
            handler: removeByte,
            icon: <FontAwesomeIcon key="RemoveByteIcon" icon={faMinus} size="1x" />, /* using 1em height/width here ensures we can use font-size to scale */
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
                <div className="control-item"
                    key={`${index}ctlitm-${control.testId}`}
                >
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
                    Bits #
                </label>
                <div>
                    <input
                        data-testid="bit-count"
                        name="bit-count"
                        id="bit-count"
                        type="text"
                        defaultValue={bitCount}                 
                        onBlur={handleBitCountChange}
                        onClick={selectInputContents} 
                        onKeyUp={changeOnEnter}
                    />
                    <div className="inc-dec">
                        <div
                            hidden={bitCount >= MAXBITS}
                            data-testid="inc-value"
                            onClick={addBit}
                            className="inc">{String.fromCodePoint(0x25b2)}
                        </div>
                        <div
                            hidden={bitCount === 1}
                            data-testid="dec-value"
                            onClick={removeBit}
                            className="dec">{String.fromCodePoint(0x25bc)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default BitControls

