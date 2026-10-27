import {type JSX, useEffect, useState} from 'react';
import type {CartItem, LocalCartItem} from "../../types/cart.ts";
import {Link} from "react-router";
import {priceFormater} from "@/utils/priceFormater.ts";
import useUpdateCartMutation from "../../hooks/useUpdateCartMutation.ts";
import {updateLocalItem} from "../../store/cart/cartSlice.ts";
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import {useDispatch} from "react-redux";
import {setSelectedProduct, showConfirmationModal} from "../../store/ui/uiSlice.ts";
import {getCartItemView} from "@/utils/getCartItemView.ts";

interface CartPageCardProps {
    // Props here
    cartItem: CartItem | LocalCartItem;
}

function CartPageCard({cartItem}: CartPageCardProps): JSX.Element {
    const productPath = `/product/${cartItem.product.name}/?product_id=${cartItem.product._id}`;
    const {mutate: mutateUpdateQuantity} = useUpdateCartMutation();
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const dispatch = useDispatch();
    const cart = useAppSelector(state => state.cart.cart);

    const [quantity, setQuantity] = useState(cartItem.quantity);
    const cartItemId = cart?.items.find((item: CartItem) => item.product._id === cartItem.product._id)?._id ?? cartItem.product._id;

    useEffect(() => {
        setQuantity(cartItem.quantity);
    }, [cartItem]);


    const handleIncreaseQuantity = () => {
        if (quantity >= 99) return;
        if (isAuthenticated) {
            mutateUpdateQuantity({itemId: cartItemId, quantity: quantity + 1});
        } else {
            dispatch(updateLocalItem({
                productId: cartItem.product._id,
                quantity: quantity + 1,
                variantId: cartItem.variantId
            }));
        }
    }

    const handleDecreaseQuantity = () => {
        if (isAuthenticated) {
            mutateUpdateQuantity({itemId: cartItemId, quantity: quantity - 1})
        } else {
            dispatch(updateLocalItem({
                productId: cartItem.product._id,
                quantity: quantity - 1,
                variantId: cartItem.variantId
            }));
        }
    }

    const handleRemoveItem = () => {
        dispatch(setSelectedProduct(cartItem.product));
        dispatch(showConfirmationModal("cart"));
    }

    const {image, colorName, colorHex} = getCartItemView(cartItem.product, cartItem.variantId);

    return (
        <div className="grid grid-cols-[auto_2fr_1fr] max-md:grid-cols-[auto_auto] gap-5 max-md:gap-3 max-md:text-sm">
            <Link to={productPath}
                  className="lg:w-52 w-28 bg-light-gray border border-light-gray rounded-lg overflow-hidden">
                <img src={`${import.meta.env.VITE_API_BASE_URL}${image}`}
                     alt={cartItem.product.name} className="w-full h-full object-cover"/>
            </Link>
            <div>
                <Link to={productPath} className="line-clamp-2">{cartItem.product.name}</Link>
                {colorName && (<p className="space-x-2 text-dark-gray mt-1">
                    <span>رنگ:</span>
                    <span style={{color: `${colorHex}`}} className="font-semibold">{colorName}</span>
                </p>)}
                <p className="text-dark-gray mt-2 max-sm:text-xs">{cartItem.product.shortDescription}</p>
            </div>
            <div
                className="flex flex-col justify-self-end gap-2 max-md:justify-self-start max-md:col-span-2 max-md:justify-self-stretch">
                <p className="space-x-1 max-md:self-end">
                    <span>{priceFormater(cartItem.product.discountPrice || cartItem.product.price)}</span>
                    <span>تومان</span>
                </p>
                <div
                    className="flex items-center justify-between gap-1 w-fit self-end bg-lightest-gray p-2 rounded-full my-auto">
                    <button onClick={handleIncreaseQuantity}
                            className="cursor-pointer px-2 hover:bg-light-gray active:bg-light-gray rounded-full">+
                    </button>
                    <input type="text" inputMode="numeric" className="w-5 text-center outline-none" value={quantity}
                           onChange={(e) => {
                               const value = e.target.value.replace(/\D/g, "");
                               if (!value || +value <= 0 || +value.length > 2 || +value === cartItem.quantity) return;
                               if (isAuthenticated && cartItemId) {
                                   mutateUpdateQuantity({itemId: cartItemId, quantity: +value});
                               } else {
                                   dispatch(updateLocalItem({
                                       productId: cartItem.product._id,
                                       quantity: +value,
                                       variantId: cartItem.variantId
                                   }))
                               }

                           }}/>
                    {quantity === 1 ? <button className="cursor-pointer px-2 py-1 hover:bg-light-gray rounded-full"
                                              onClick={handleRemoveItem}>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
                             height="0.9em" width="0.9em" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                        </svg>
                    </button> : <button onClick={handleDecreaseQuantity}
                                        className="cursor-pointer hover:bg-light-gray active:bg-light-gray rounded-full px-2">-</button>}
                </div>
            </div>
        </div>
    );
}

export default CartPageCard;