import { CSSProperties, useEffect, useRef, useState } from "react"
import _, { isEqual } from 'lodash';
import "../css/Controls.css";

interface ValueControlsProps {
    currentIntValue: number,
    onChangeIntValue?: (intValue: number) => void
}

const ValueControls: React.FC<ValueControlsProps> = ({
    currentIntValue,
    onChangeIntValue = () => 0 // default to 0 if no value provided, useful for testing
}) => {

    const MAXBITS = 64
    const toHex = (newIntValue: number): string => {
        const bitCount = Number(newIntValue).toString(2).length
        const numBytes = Math.ceil(bitCount / 8);
        return '0x' + newIntValue.toString(16).padStart(2 * numBytes, '0').toUpperCase()
    }
    const [intValue, setIntValue] = useState(currentIntValue)
    const [hexValue, setHexValue] = useState(toHex(intValue))
    const decrementValue = () => setIntValue(intValue - 1)
    const incrementValue = () => setIntValue(intValue + 1)
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setHexValue((prevHexValue) => {
            const newHexValue = toHex(intValue)
            return prevHexValue === newHexValue ? prevHexValue : newHexValue
        })
        onChangeIntValue(intValue)
    }, [intValue])

    const handleIntChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = parseInt(event.target.value, 10); // Convert input to number
        setIntValue(isNaN(value) ? 0 : value); // Fallback to 0 if input is invalid
    }

    const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setIntValue(parseInt(event.target.value, 16)) // convert hex to int
    }

    const makeHexColor = (num: number) => {
        return "#" +
            Number(num).toString(16)
                .padStart(6, '0')
                .slice(-6)
                .toUpperCase();
    }



    const getTextColor = (backgroundColor: String) => {

        type RGB = {
            r: number;
            g: number;
            b: number;
        };

        // Helper to convert hex to RGB
        const hexToRgb = (hex: String) => {
            const bigint = parseInt(hex.slice(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return { r, g, b };
        };

        // Calculate luminance
        const calculateLuminance = ({ r, g, b }: RGB) => {
            const normalize = (value: number) => {
                value /= 255;
                return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
            };

            const rNorm = normalize(r);
            const gNorm = normalize(g);
            const bNorm = normalize(b);

            return 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
        };

        // Convert hex color to RGB
        const rgb = backgroundColor.startsWith("#")
            ? hexToRgb(backgroundColor)
            : { r: 0, g: 0, b: 0 }; // Fallback to black if invalid

        // Calculate the luminance
        const luminance = calculateLuminance(rgb);

        // Return white text for dark backgrounds and black text for light backgrounds
        return luminance > 0.5 ? "#000000" : "#FFFFFF";
    };

    const setColorValueStyles = (num: number) => {
        const styles: CSSProperties = {
            backgroundColor: 'inherit',
            color: 'inherit',
        }
        if (num <= 16777215) {
            styles.backgroundColor = makeHexColor(num)
        }
        return styles
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Return") {
            console.log("hello, world")
            inputRef.current?.blur(); // Programmatically blur the input
        }
    };

    const valueControlsList = [
        {
            label: "Hex Value",
            testId: "hex-value",
            handler: handleHexChange,
            value: hexValue,
        },
        {
            label: "Integer Value",
            testId: "int-value",
            handler: handleIntChange,
            value: intValue,
        },
    ]

    const valueReadOnlyList = [
        {
            label: "Character",
            testId: "char-value",
            value: (intValue <= 1114112) ? String.fromCodePoint(intValue) : '[N/A]',
        },
        {
            label: "Color",
            testId: "color-value",
            value: makeHexColor(intValue),
            style: setColorValueStyles(intValue)
        },
    ]

    return (
        <div
            className="control"
            id="value-controls"
            data-testid="value-controls"
        >
            {valueControlsList.map((control, index) => (
                <div className="value-control-item">
                    <label htmlFor={`value-control-${index}`}>
                        {control.label}
                    </label>
                    <div className="inc-dec">
                        <span
                            hidden={intValue >= Math.pow(2, MAXBITS)}
                            data-testid="inc-value"
                            onClick={incrementValue}
                            className="inc">{String.fromCodePoint(0x25b2)}</span>
                        <span
                            hidden={intValue === 0}
                            data-testid="dec-value"
                            onClick={decrementValue}
                            className="dec">{String.fromCodePoint(0x25bc)}</span>
                    </div>
                    <input
                        id={`value-control-${control.testId}-${index}`}
                        key={`value-control-${control.testId}-${index}`}
                        ref={inputRef}
                        data-testid={control.testId}
                        name={control.testId}
                        onBlur={control.handler}
                        defaultValue={control.value.toString()}
                        onKeyDown={handleKeyDown}
                        title={control.value.toString()}
                    />
                    
                </div>
            ))}

            {valueReadOnlyList.map((control, index) => (
                <div className="value-control-item"
                    hidden={control.value === '[N/A]'
                    }
                >
                    <label htmlFor={`value-control-${index}`}>
                        {control.label}
                    </label>
                    <input
                        readOnly
                        id={`value-control-${control.testId}-${index}`}
                        key={`value-control-${control.testId}-${index}`}
                        data-testid={control.testId}
                        name={control.testId}
                        value={control.value.toString()}
                        title={control.value.toString()}
                        style={control.style}
                    />
                </div>
            ))}
        </div>
    )
}
export default ValueControls
