import { useEffect, useRef, useState } from "react"
import _, {isEqual} from 'lodash'
import "../css/ByteControls.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateLeft, faRotateRight, faArrowsRotate, faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons'

interface ByteControlProperties {
    byteNumber?: number,
    bits: string[],
    position?: 'start' | 'end',
    onByteChange: (byteNumber: number, bits: string[]) => void,
}

const ByteControls: React.FC<ByteControlProperties> = ({bits, byteNumber = 0, onByteChange, position = 'start'}) => {

    const flipBits = (event: React.MouseEvent<HTMLButtonElement>): void => {
        const updatedBits = [...bits]
        onByteChange( byteNumber, updatedBits.map((b) => b === '0' ? '1' : '0' ))
    }

    const resetBits = (event: React.MouseEvent<HTMLButtonElement>): void => {
        const updatedBits = [...bits]
        onByteChange(byteNumber, updatedBits.map(() => '0' ))
    }

    const shiftBits = (bits: string[], direction: 'left' | 'right', overflow: boolean = true): string[] => {
        const result = [...bits];
        if (direction === 'left') {
            const lastBit = result[result.length - 1];
            for (let i = result.length - 1; i > 0; i--) {
                result[i] = result[i - 1];
            }
            result[0] = overflow ? lastBit : '0';
        } else {
            const firstBit = result[0];
            for (let i = 0; i < result.length - 1; i++) {
                result[i] = result[i + 1];
            }
            result[result.length - 1] = overflow ? firstBit : '0';
        }
        return result;
    };

    const shiftByte = (direction: 'left' | 'right') => (event: React.MouseEvent<HTMLButtonElement>): void => {
        const updatedBits = shiftBits([...bits], direction);
        onByteChange(byteNumber, updatedBits);
    };

    const byteControlsList = [    
        {
            position: 'end',
            label: "Reset all bits in the byte to 0",
            icon: <FontAwesomeIcon icon={faRotateLeft} size="2xl" color="mediumseagreen" />,
            testId: "reset-byte",
            handler: resetBits,
        },
        {
            position: 'end',
            label: "Swap all bits in the byte",
            icon: <FontAwesomeIcon icon={faArrowsRotate}size="2xl" color="mediumseagreen"  />,
            testId: "flip-byte",
            handler: flipBits,
        },
        {
            position: 'start',
            label: "Shift all bits in the byte to the right",
            icon: <FontAwesomeIcon icon={faAngleDoubleRight} size="2xl" color="mediumseagreen" />,
            testId: "shift-bits-right",
            handler: shiftByte('right'),
        },
        {
            position: 'start',
            label: "Shift all bits in the byte to the left",
            icon: <FontAwesomeIcon icon={faAngleDoubleLeft} size="2xl" color="mediumseagreen" />,
            testId: "shift-bits-left",
            handler: shiftByte('left'),
        },
    ]

    return (
        <div className="byte-controls">
            {byteControlsList.map((control, index) => (
                control.position === position && (
                    <button
                        key={`${control.testId}-${byteNumber}`}
                        id={`${control.testId}-${byteNumber}`}
                        data-testid={control.testId}
                        onClick={control.handler}
                        aria-label={control.label}
                    >
                        {control.icon}
                    </button>
                )
            ))}
        </div>
    )
}
export default ByteControls