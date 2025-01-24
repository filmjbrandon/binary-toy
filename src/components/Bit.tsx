import { useEffect, useState } from "react";
import "../css/Bit.css";

// Define types for the BinaryDigit props
interface BitProps {
    index?: number // The index of this digit in the binary array defaults to 0
    defaultValue?: number // The binary digit (either "0" or "1") defaults to 0
    onToggleBit?: (index: number) => void // Function to toggle a digit
}

const Bit: React.FC<BitProps> = ({ index = 0, defaultValue = 0, onToggleBit }) => {
    const [bitValue, setBitValue] = useState(defaultValue)
    const handleToggle = () => {
        if (!onToggleBit)
            setBitValue(Number(!bitValue))
        else
            onToggleBit(index)
    }

    return (
        <div className="bit-container">
            <label
                data-testid="bit-label"
                htmlFor={`bit-${index}`}
            >
                {index}
            </label>
            <div
                onClick={handleToggle}
                data-testid={`bit-${index}`}
                id={`bit-${index}`}
                className="bit"
            >
                {onToggleBit ? defaultValue : bitValue}
            </div>
                                                                                                                                                                                                                                          </div>
    )
}
export default Bit