import type {Product} from "@/types/product.ts";
import {priceFormater} from "@/utils/priceFormater.ts";
import {getCartItemView} from "@/utils/getCartItemView.ts";

interface CheckoutProductCartProps {
    // Props here
    product: Product;
    productQuantity: number;
    variantId: string | undefined;
}

function CheckoutProductCart({product, productQuantity, variantId}: CheckoutProductCartProps) {
    const {colorName, image} = getCartItemView(product, variantId);


    if (!product) return null;

    return (
        <li key={product._id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-17 h-17">
                    <img src={`${import.meta.env.VITE_API_BASE_URL}${image}`}
                         alt={product.name}
                         className="w-full h-full object-cover  rounded-lg bg-light-gray border border-light-gray"/>
                </div>

                <p className="flex flex-col text-[14px] text-dark-gray">
                    <span className="text-[16px] max-md:text-[15px] truncate text-black max-md:max-w-[20ch]">{product.name}</span>
                    {colorName && (<span>{colorName}</span>)}
                    <span className="flex items-center gap-1">
                        <span>تعداد:</span>
                        <span className="mb-0.5">{productQuantity}</span>
                    </span>
                </p>

            </div>

            {<span className="max-md:text-sm">{priceFormater(product.discountPrice || product.price)}</span>}
        </li>
    );
}

export default CheckoutProductCart;