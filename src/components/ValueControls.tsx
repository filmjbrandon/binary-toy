import { CSSProperties, useEffect, useRef, useState } from "react"
import _, { isEqual } from 'lodash';
import "../css/ValueControls.css";

interface ValueControlsProps {
    currentIntValue: number,
    onChangeIntValue?: (intValue: number) => void
}

const ValueControls: React.FC<ValueControlsProps> = ({
    currentIntValue,
    onChangeIntValue = () => 0 // default to 0 if no value provided, useful for testing
}) => {

    console.debug("Loading ValueControls");

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

    const handleCharChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const codePoint = (event.target.value).codePointAt(0)?.toString(16) // represent as hex for efficiency
        if (codePoint) 
            setIntValue(parseInt(codePoint, 16)) // convert hex to int
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
            const color = makeHexColor(num)
            styles.backgroundColor = color
            styles.color = getTextColor(color)
        }
        return styles
    }

    const selectInputContents = (event: React.MouseEvent<HTMLInputElement>): void => {
        const input = event.target as HTMLInputElement
        input.focus()
        input.select()
    }

    const changeOnEnter = (event: React.KeyboardEvent<HTMLInputElement>, handler:Function): void => {
        const input = event.target as HTMLInputElement
        if (event.key === 'Enter') {
            console.debug(`changeOnEnter: Enter pressed on event`)
            handler({ target: event.target } as React.ChangeEvent<HTMLInputElement>);
        }
    }

    const valueControlsList = [
        {
            label: "Hex",
            testId: "hex-value",
            handler: handleHexChange,
            value: hexValue,
        },
        {
            label: "Integer",
            testId: "int-value",
            handler: handleIntChange,
            value: intValue,
        },
        {
            label: "Character",
            testId: "char-value",
            value: (intValue <= 1114112) ? String.fromCodePoint(intValue) : '[N/A]',
            handler: handleCharChange,
        },
    ]

    const valueReadOnlyList = [
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
                <div 
                    className="value-control-item"
                    key={`vcci1-${control.testId}-${index}`}
                >
                    <label htmlFor={`value-control-${index}`}>
                        {control.label}
                    </label>
                    <div>
                        <input
                            id={`value-control-${control.testId}-${index}`}
                            key={`vc-${control.testId}-${index}`}
                            data-testid={control.testId}
                            name={control.testId}
                            onBlur={control.handler}
                            defaultValue={control.value.toString()}
                            onClick={selectInputContents}
                            onKeyUp={(e)=>changeOnEnter(e, control.handler)}
                            title={control.value.toString()}
                        />
                        <div className="inc-dec">
                            <div
                                hidden={intValue >= Math.pow(2, MAXBITS)}
                                data-testid="inc-value"
                                onClick={incrementValue}
                                className="inc">{String.fromCodePoint(0x25b2)}
                            </div>
                            <div
                                hidden={intValue === 0}
                                data-testid="dec-value"
                                onClick={decrementValue}
                                className="dec">{String.fromCodePoint(0x25bc)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
                {valueReadOnlyList.map((control, index) => (
                <div className="value-control-item"
                    key={`vcci2-${control.testId}-${index}`}
                    hidden={control.value === '[N/A]'
                    }
                >
                    <label key={`lblvc-${index}`} htmlFor={`vc-${index}`}>
                        {control.label}
                    </label>
                    <input
                        readOnly
                        id={`value-read-${index}`}
                        key={`vc-${control.testId}-${index}`}
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
