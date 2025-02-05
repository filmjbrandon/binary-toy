import { useEffect, useRef, useState } from "react"
import _, {isEqual} from 'lodash'
import "../css/Controls.css";

interface ByteControlProperties {
    byteNumber?: number,
    bits: string[],
    onByteChange: (byteNumber: number, bits: string[]) => void,
}

const ByteControls: React.FC<ByteControlProperties> = ({bits, byteNumber = 0, onByteChange}) => {

    const flipBits = (event: React.MouseEvent<HTMLButtonElement>): void => {
        const updatedBits = [...bits]
        onByteChange( byteNumber, updatedBits.map((b) => b === '0' ? '1' : '0' ))
    }

    const resetBits = (event: React.MouseEvent<HTMLButtonElement>): void => {
        const updatedBits = [...bits]
        onByteChange(byteNumber, updatedBits.map(() => '0' ))
    }

    const byteControlsList = [    
        {
            label: "Clear",
            testId: "reset-byte",
            handler: resetBits,
        },
        {
            label: "Flip",
            testId: "flip-byte",
            handler: flipBits,
        },
        // {
        //     label: "Left Shift Bits",
        //     testId: "shift-bits-left",
        //     handler: shiftBits,
        // },
        // {
        //     label: "Right Shift Bits",
        //     testId: "shift-bits-right",
        //     handler: shiftBits,
        // },
    ]

    return (
        <div className="byte-controls">
            {byteControlsList.map((control, index)=> (
                <button
                    id={`${control.testId}-${byteNumber}`}
                    data-testid={control.testId}
                    onClick={control.handler}
                >
                    {control.label}
                </button>

            ))}
        </div>
    )
}
export default ByteControls