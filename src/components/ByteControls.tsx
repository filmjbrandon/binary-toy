import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import _, {isEqual} from 'lodash'
import "../css/ByteControls.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateLeft, faRotateRight, faArrowsRotate, faAngleDoubleRight, faAngleDoubleLeft, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

interface ByteControlProperties {
    byteNumber?: number, // defaults to 0
    bits: string[],
    onByteChange: (byteNumber: number, bits: string[]) => void,
    config?: {
        overflow?:true|false // defaults to true
    }
}

const ByteControls: React.FC<ByteControlProperties> = ({bits, byteNumber = 0, onByteChange, config={overflow:true}}) => {

    console.debug("Loading ByteControls")
    const [showControls, setShowControls] = useState(false)


    useLayoutEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
    
            // Check if the click is inside the menu (more reliable)
            if (!target.closest('.byte-controls-button, .byte-control-item, .bit')) {
                setShowControls(false);
            }
        };
    
        document.addEventListener("click", handleClick);
    
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    const flipBits = (event: React.MouseEvent<HTMLElement>): void => {
        const updatedBits = [...bits]
        onByteChange( byteNumber, updatedBits.map((b) => b === '0' ? '1' : '0' ))
    }

    const resetBits = (event: React.MouseEvent<HTMLElement>): void => {
        const updatedBits = [...bits]
        onByteChange(byteNumber, updatedBits.map(() => '0' ))
    }

    const shiftBits = (bits: string[], direction: 'left' | 'right'): string[] => {
        const result = [...bits];
        const useOverflow: boolean = config.overflow || false
        if (direction === 'left') {
            const lastBit = result[result.length - 1];
            for (let i = result.length - 1; i > 0; i--) {
                result[i] = result[i - 1];
            }
            result[0] = useOverflow ? lastBit : '0';
        } else {
            const firstBit = result[0];
            for (let i = 0; i < result.length - 1; i++) {
                result[i] = result[i + 1];
            }
            result[result.length - 1] = useOverflow ? firstBit : '0';
        }
        return result;
    };

    const shiftByte = (direction: 'left' | 'right') => (event: React.MouseEvent<HTMLElement>): void => {
        const updatedBits = shiftBits([...bits], direction);
        onByteChange(byteNumber, updatedBits);
    };

    const byteControlsList = [    
        {
            label: "Reset",
            icon: <FontAwesomeIcon icon={faRotateLeft} size="1x" color="mediumseagreen" />, /* using 1em height/width here ensures we can use font-size to scale */
            testId: "reset-byte",
            handler: resetBits,
        },
        {
            label: "Swap",
            icon: <FontAwesomeIcon icon={faArrowsRotate}size="1x" color="mediumseagreen" />, /* using 1em height/width here ensures we can use font-size to scale */
            testId: "flip-byte",
            handler: flipBits,
        },
        {
            label: "Shift Right",
            icon: <FontAwesomeIcon icon={faAngleDoubleRight} size="1x" color="mediumseagreen" />, /* using 1em height/width here ensures we can use font-size to scale */
            testId: "shift-bits-right",
            handler: shiftByte('right'),
        },
        {
            label: "Shift Left",
            icon: <FontAwesomeIcon icon={faAngleDoubleLeft} size="1x" color="mediumseagreen" height="1em" width="1em" />, /* using 1em height/width here ensures we can use font-size to scale */
            testId: "shift-bits-left",
            handler: shiftByte('left'),
        },
    ]

    return (
        <div>
            {/* <button
                data-testid="byte-controls-button"
                className="byte-controls-button"
                onClick={()=>{setShowControls(true)}}
            >
                Byte Controls
            </button> */}
            <div data-testid="byte-controls-container" className={`byte-controls ${showControls ? 'dropdown' : ''}`}>
                <ul data-testid={`byte-controls-${byteNumber}`}>
                {byteControlsList.map((control, index) => (
                        <li
                            key={`${control.testId}-${byteNumber}`}
                            id={`${control.testId}-${byteNumber}`}
                            data-testid={control.testId}
                            onClick={control.handler}
                            aria-label={control.label}
                            className="byte-control-item"
                        >
                       {control.label}
                        </li>
                ))}
                </ul>
            </div>
        </div>
    )
}
export default ByteControls