import {priceFormater} from "../util/priceFormater.ts";

interface DiscountPriceProps {
    // Props here
    discount: number;
    className?: string;
}

function DiscountPrice({discount, className}: DiscountPriceProps) {
    if (!discount) return;
    return (
        <p className={`relative text-dark-gray w-fit ${className}`}>
            <span>{priceFormater(discount)}</span>
            <span className="absolute w-full h-[1px] bg-dark-gray top-1/2 left-0"/>
        </p>
    );
}

export default DiscountPrice;