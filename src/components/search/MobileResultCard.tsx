import type {JSX} from 'react';
import type {Product} from "@/types/product.ts";
import {IoMdStar} from "react-icons/io";
import {priceFormater} from "@/utils/priceFormater.ts";
import DiscountPrice from "@/UI/DiscountPrice.tsx";
import {Link} from "react-router";

interface MobileResultCardProps {
    // Props here
    product: Product;
    priority: boolean;
}

function MobileResultCard({product, priority}: MobileResultCardProps): JSX.Element {
    const hasDiscount = product.discountPrice > 0;

    return (
        <Link to={`/product/${product.name}?product_id=${product._id}`}
              className="flex flex-col text-gray-700 border border-gray-100 rounded-2xl p-2 h-full">
            <div
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-lightest-gray shadow-raised">
                <img loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding={"async"}
                     src={`${import.meta.env.VITE_API_BASE_URL}${product.images[0]}`} alt={product.name}
                     className="w-full h-full object-cover"/>
                {product.discountPercent > 0 &&
                    <span
                        className="absolute top-2 inset-s-2 w-10 h-7 rounded-full flex items-center justify-center px-2 py-0.5 bg-primary-red text-white">{product.discountPercent}%</span>}
            </div>

            <h2 className="text-sm line-clamp-2 mt-4">{product.name}</h2>
            {product.rating > 0 && <div className="text-start flex items-center gap-1">
                <p className="text-gray-600">{product.rating}</p>
                <IoMdStar className="text-yellow-400"/>
            </div>}

            <div>
                <p className="text-gray-800 font-semibold space-x-1.5">
                    <span>{priceFormater(hasDiscount ? product.discountPrice : product.price)}</span><span>تومان</span>
                </p>
                {hasDiscount && (
                    <DiscountPrice discount={product.price} className="text-sm"/>
                )}
            </div>

        </Link>
    );
}

export default MobileResultCard;