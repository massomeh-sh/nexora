import {type JSX, useEffect, useId, useRef} from 'react';

interface UpdateQuantityWithDeleteBtnProps {
    // Props here
    onIncreaseQuantity: () => void;
    onDecreaseQuantity: () => void;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    onUpdateCartQuantity: (finalQuantity: number) => void;
    onRemoveItem: () => void;
    className?: string;
}

function UpdateQuantityWithDeleteBtn({
                                         onIncreaseQuantity,
                                         className,
                                         onDecreaseQuantity,
                                         quantity,
                                         onQuantityChange,
                                         onUpdateCartQuantity,
                                         onRemoveItem,
                                     }: UpdateQuantityWithDeleteBtnProps): JSX.Element {

    const inputId = useId();
    const timerRef = useRef<ReturnType<typeof setTimeout>>(0);


    useEffect(() => {
        return () => {
            clearTimeout(timerRef.current);
        }
    }, [])

    return (
        <div
            className={`mr-auto bg-lightest-gray px-4 py-2 rounded-sm flex justify-center items-center text-sm relative z-10 h-6 lg:h-8 gap-3 ${className ?? ""}`}>
            <button onClick={onIncreaseQuantity}
                    className="cursor-pointer flex items-center justify-center active:scale-105 hover:scale-125">+
            </button>
            <input aria-label="تعداد" id={inputId} style={{width: "3ch"}} type="text" inputMode="numeric"
                   value={quantity === 0 ? "" : quantity} onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length > 2) return;
                onQuantityChange(value === "" ? 0 : +value)

                clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {

                    if (value !== "" && +value >= 1) onUpdateCartQuantity(+value);
                }, 500)

            }
            } onBlur={() => {
                if (quantity < 1) {
                    onQuantityChange(1);
                    onUpdateCartQuantity(1);
                }
            }} className="text-center w-[3ch]"/>
            <div>{quantity === 1 ?
                <button onClick={onRemoveItem}
                        className="cursor-pointer flex items-center justify-center active:scale-125 hover:scale-125">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
                         height="0.9em" width="0.9em" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                    </svg>
                </button> :
                <button onClick={onDecreaseQuantity}
                        className="active:scale-125 hover:scale-125 cursor-pointer flex items-center justify-center">-</button>}</div>
        </div>
    );
}

export default UpdateQuantityWithDeleteBtn;