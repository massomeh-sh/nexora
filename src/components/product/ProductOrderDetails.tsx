import {useMemo} from 'react';
import type {Product} from "../../types/product.ts";
import {priceFormater} from "../../util/priceFormater.ts";
import {Link} from "react-router";
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import useAddToCart from "../../hooks/useAddToCart.ts";
import {useDispatch} from "react-redux";
import {addLocalItem, makeSelectIsInCart} from "../../store/cart/cartSlice.ts";
import {showCartSidebar, showProductSharingModal} from "../../store/ui/uiSlice.ts";
import DiscountPrice from "../../UI/DiscountPrice.tsx";
import {useCartQuantity} from "../../hooks/useCartQuantity.ts";
import UpdateQuantityWithDeleteBtn from "../../UI/product/UpdateQuantityWithDeleteBtn.tsx";

interface ProductOrderDetailsProps {
    // Props here
    product: Product;
}

function ProductOrderDetails({product}: ProductOrderDetailsProps) {
    const {mutate: mutateAddToCart} = useAddToCart();
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const dispatch = useDispatch();
    const selectIsInCart = useMemo(() => makeSelectIsInCart(), []);
    const currentCartItem = useAppSelector(state => selectIsInCart(state, product?._id || ""));
    const cart = useAppSelector(state => state.cart);
    const itemId = cart?.cart?.items.find((i) => i.product._id === product?._id)?._id || product?._id;

    const productQuantity = currentCartItem?.isInCart ? currentCartItem?.selectedItem.quantity : product?.quantity;

    const {
        inputQuantity: quantity,
        handleIncreaseQuantity,
        handleDecreaseQuantity,
        handleUpdateQuantity,
        handleUpdateCartQuantity,
        handleRemoveItem
    } = useCartQuantity(productQuantity, isAuthenticated, itemId, product);

    if (!product) return null;

    const handleAddToCart = () => {
        if (isAuthenticated) {
            mutateAddToCart({productId: product._id, quantity: 1});
        } else {
            dispatch(addLocalItem({product, quantity: 1}));
        }
        dispatch(showCartSidebar());
    }

    return (
        <div
            className="flex flex-col gap-5 bg-white rounded-lg lg:w-1/4 w-full px-6 py-7 sticky top-[140px] text-lg h-fit">
            <h2 className=" font-semibold border-b border-light-gray pb-3">جزعیات سفارش</h2>

            <div className="flex flex-col gap-5">


                <div className="flex items-center justify-center gap-4">
                    <img src={`${import.meta.env.VITE_API_BASE_URL}${product?.images?.[0]}`}
                         alt={product?.name}
                         className="w-1/4 h-full object-cover rounded-sm bg-light-gray border border-light-gray"/>
                    <p className="self-center font-semibold">{product?.name}</p>
                </div>


                <div className="flex flex-col gap-1 mr-auto">
                    <p className="mr-auto">
                        <span>{product.stock} </span>
                        <span className="text-dark-gray">:موجودی</span>
                    </p>


                    {product?.discountPrice && <div className="flex gap-2">
                        <DiscountPrice discount={product?.price} className="text-sm"/>
                        <span className="bg-primary-red px-3 text-white text-sm rounded-full">
                                    {product.discountPercent}%
                                </span>
                    </div>}
                    <p className="mr-auto space-x-1">
                        <span>{priceFormater(product?.discountPrice || 0)}</span>
                        <span className="text-sm">تومان</span>
                    </p>
                </div>

                {!currentCartItem?.isInCart && <div className="w-full bg-light-gray h-[0.2px]"/>}

                {currentCartItem?.isInCart &&
                    <div className="ml-auto">
                        <UpdateQuantityWithDeleteBtn onIncreaseQuantity={handleIncreaseQuantity}
                                                     onDecreaseQuantity={handleDecreaseQuantity} quantity={quantity}
                                                     onQuantityChange={handleUpdateQuantity}
                                                     onUpdateCartQuantity={handleUpdateCartQuantity}
                                                     onRemoveItem={handleRemoveItem}/>
                    </div>}

                {currentCartItem?.isInCart &&
                    <div className='flex items-center justify-between border-t border-light-gray pt-3'>
                        <p className="text-dark-gray text-sm">جمع قیمت:</p>
                        <p className=" space-x-1">
                            <span>{priceFormater((product?.discountPrice || product?.price) * (quantity === 0 ? 1 : quantity))}</span>
                            <span>تومان</span>
                        </p>
                    </div>}
            </div>

            <Link to="/checkout" className="bg-primary-blue text-white px-2 py-3 rounded-sm text-center button-shake">ثبت
                سفارش
                محصول</Link>
            {!currentCartItem?.isInCart && <button onClick={handleAddToCart}
                                                   className="flex items-center justify-center gap-1 px-2 py-3 rounded-sm text-primary-blue border border-primary-blue -my-2 cursor-pointer hover:bg-primary-blue active:bg-white transition-colors duration-500 hover:text-white active:text-primary-blue">
                <span>افزودن به سبد خرید</span>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
                     height="1em"
                     width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V15H18.4433L20.4433 7H8.00488V5H21.7241C22.2764 5 22.7241 5.44772 22.7241 6C22.7241 6.08176 22.7141 6.16322 22.6942 6.24254L20.1942 16.2425C20.083 16.6877 19.683 17 19.2241 17H5.00488C4.4526 17 4.00488 16.5523 4.00488 16ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z"></path>
                </svg>
            </button>}
            <div className="bg-light-gray w-full h-[0.9px] mt-1"/>

            <button className="text-sm flex items-center self-end gap-1 text-dark-gray cursor-pointer"
                    onClick={() => dispatch(showProductSharingModal())}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                     fill="none">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z"
                          fill="currentColor"/>
                </svg>
                <span>اشتراک گذاری لینک محصول</span>
            </button>

        </div>
    );
}

export default ProductOrderDetails;