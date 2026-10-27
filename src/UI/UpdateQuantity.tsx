import {type JSX, useEffect, useState} from 'react';

interface SetQuantityProps {
    className?: string;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
}

function UpdateQuantity({className = "py-2", quantity, onQuantityChange}: SetQuantityProps): JSX.Element {
    const [text, setText] = useState(String(quantity));

    useEffect(() => {
        setText(String(quantity));
    }, [quantity]);

    return (
        <div
            className={`bg-light-gray flex justify-between items-center px-2 rounded-sm ${className}`}>
            <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="bg-white px-3 py-0.5 hover:bg-primary-blue hover:text-white rounded-sm cursor-pointer transition-colors duration-300">-
            </button>

            <input type="text" inputMode="numeric" value={text} onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length > 2) return;

                setText(value);

                if (value !== "" && +value >= 1) {
                    onQuantityChange(+value)
                }
            }} onBlur={() => {
                setText(String(quantity))
            }}
                   className="text-sm w-12 text-center outline-none"/>
            <button
                onClick={() => onQuantityChange(Math.min(99, quantity + 1))}
                className="bg-white px-3 py-0.5 hover:bg-primary-blue hover:text-white rounded-sm cursor-pointer transition-colors duration-300">+
            </button>
        </div>
    );
}

export default UpdateQuantity;