import {type JSX} from 'react';

interface SetQuantityProps {
    className?: string;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
}

function UpdateQuantity({className = "py-2", quantity, onQuantityChange}: SetQuantityProps): JSX.Element {
    return (
        <div
            className={`bg-light-gray flex justify-between items-center px-2 rounded-sm ${className}`}>
            <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="bg-white px-3 py-0.5 hover:bg-primary-blue hover:text-white rounded-sm cursor-pointer transition-colors duration-300">-
            </button>

            <input type="text" inputMode="numeric" value={quantity} onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value === "" || +value <= 0 || +value.length > 2) {
                    onQuantityChange(1)
                    return;
                }

                onQuantityChange(+value)
            }} onBlur={() => {
                const value = Number(quantity);
                if (!value || value < 1 || value.toString().length > 2) {
                    onQuantityChange(1);
                    return;
                }
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