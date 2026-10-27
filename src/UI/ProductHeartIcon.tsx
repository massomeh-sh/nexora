import type {JSX} from 'react';
import type {Product} from "../types/product.ts";
import {BiHeart, BiSolidHeart} from "react-icons/bi";

interface AddToWishlistIconProps {
    // Props here
    wishlistItems: Product[];
    isFavoriteProduct: boolean;
}

function ProductHeartIcon({wishlistItems, isFavoriteProduct}: AddToWishlistIconProps): JSX.Element {
    return (
        <>
            {isFavoriteProduct ? <BiSolidHeart className="text-primary-red"/> : <BiHeart/>}
            <span
                className={`bg-primary-blue px-1.5 py-0.5 leading-none text-white absolute left-[-8px] top-[-8px] flex items-center justify-center rounded-full ${wishlistItems?.length === 0 ? "hidden" : "block"}`}>{wishlistItems?.length}</span>
        </>
    );
}

export default ProductHeartIcon;