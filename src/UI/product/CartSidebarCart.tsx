import {type JSX} from 'react';
import type {Product} from "../../types/product.ts";
import {Link, useNavigate} from "react-router";
import {priceFormater} from "../../util/priceFormater.ts";
import UpdateQuantityWithDeleteBtn from "../UpdateQuantityWithDeleteBtn.tsx";
import {useCartQuantity} from "../../hooks/useCartQuantity.ts";
import {useDispatch} from "react-redux";
import {hideCartSidebar} from "../../store/ui/uiSlice.ts";

interface CartSidebarCartProps {
    // Props here
    product: Product;
    productQuantity: number;
    isAuthenticated: boolean;
    itemId?: string;
}


function CartSidebarCart({
                             product,
                             productQuantity,
                             isAuthenticated,
                             itemId
                         }: CartSidebarCartProps): JSX.Element {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        inputQuantity,
        handleIncreaseQuantity,
        handleDecreaseQuantity,
        handleUpdateQuantity,
        handleUpdateCartQuantity,
        handleRemoveItem
    } = useCartQuantity(productQuantity, isAuthenticated, itemId, product);


    return (
        <div className="flex group relative gap-3 py-2 max-lg:text-sm max-md:text-xs">
            <Link to="" onClick={(e) => {
                e.preventDefault();
                navigate(`/product/${product.name}/?product_id=${product._id}`);
                dispatch(hideCartSidebar());
            }} className="absolute inset-0"/>
            <div
                className="w-1/3 h-full max-md:self-center bg-light-gray border border-light-gray rounded-2xl overflow-hidden pointer-events-none">
                <img src={`${import.meta.env.VITE_API_BASE_URL}${product.images[0]}`} alt={product.name}
                     className="w-full h-full object-cover block transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110"/>
            </div>
            <div className="w-full self-center">
                <p className="line-clamp-2">{product.name}</p>
                <div className="flex max-sm:flex-col max-sm:gap-2 items-center mt-2">
                    <div className="text-green-600 flex items-center gap-1 h-4 relative z-10 max-sm:self-start">
                        <p className="space-x-1">
                            <span>{priceFormater((product.discountPrice) * productQuantity)}</span>
                            <span>تومان</span>
                        </p>
                        <p className="flex items-center justify-center"><span
                            className="mt-0.5">x</span><span>{productQuantity}</span></p>
                    </div>
                    <UpdateQuantityWithDeleteBtn onIncreaseQuantity={handleIncreaseQuantity}
                                                 onDecreaseQuantity={handleDecreaseQuantity} quantity={inputQuantity}
                                                 onUpdateCartQuantity={handleUpdateCartQuantity}
                                                 onQuantityChange={handleUpdateQuantity}
                                                 onRemoveItem={handleRemoveItem}/>
                </div>
            </div>
        </div>
    );
}

export default CartSidebarCart;