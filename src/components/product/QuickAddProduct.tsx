import {type JSX, useEffect, useMemo, useState} from 'react';
import type {Product} from "@/types/product.ts";
import UpdateQuantityWithDeleteBtn from "../../UI/UpdateQuantityWithDeleteBtn.tsx";
import {useProductCart} from "@/hooks/useProductCart.ts";
import {useCartQuantity} from "@/hooks/useCartQuantity.ts";
import DiscountPrice from "@/UI/DiscountPrice.tsx";
import {priceFormater} from "@/utils/priceFormater.ts";
import {makeSelectIsInWishlist} from "@/store/wishlist/wishlistSlice.ts";
import {useAppSelector} from "@/hooks/useAppSelector.ts";
import useToggleWishlist from "@/hooks/useToggleWishlist.tsx";
import ProductHeartIcon from "@/UI/ProductHeartIcon.tsx";

interface ProductQuickAddBarProps {
    // Props here
    product: Product
    onSelectValue: (variantId: string) => void;
    selectedVariantId: string | undefined;
}

function QuickAddProduct({product, onSelectValue, selectedVariantId}: ProductQuickAddBarProps): JSX.Element {
    const {productQuantity, isAuthenticated, itemId, currentCartItem, handleAddToCart} = useProductCart(product);
    const [showQuickAdd, setShowQuickAdd] = useState<boolean>(false);
    const wishlistItems = useAppSelector(state => state.wishlist.items);

    const selectIsInWishList = useMemo(() => makeSelectIsInWishlist(), []);
    // This will give us the selector we want and why we do this? Why don't we use the selector that is already in wishlistSlice and don't create different one? because we want a specific selector for each product so they don't overwrite the other selector cache!

    const isFavoriteProduct = useAppSelector(state => selectIsInWishList(state, product._id));

    const {handleWishlist} = useToggleWishlist();

    useEffect(() => {
        const onScroll = () => {
            const currentScroll = window.scrollY;
            setShowQuickAdd(currentScroll > 400);
        }
        window.addEventListener("scroll", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, [])

    const {
        inputQuantity: quantity,
        handleIncreaseQuantity,
        handleDecreaseQuantity,
        handleUpdateQuantity,
        handleUpdateCartQuantity,
        handleRemoveItem
    } = useCartQuantity(productQuantity, isAuthenticated, itemId, product);

    const variants = product.variants ?? [];

    const selectorOptions = variants.map((o) => (
        {id: o._id, label: o.colorName, color: o.colorHex}
    ));

    return (
        <div inert={!showQuickAdd} aria-hidden={!showQuickAdd}
             className={`fixed z-20 bg-linear-to-b from-white via-lightest-gray to-indigo-100 shadow-[0_0_2px_rgba(0,0,0,0.4)] w-full px-32 py-4 max-lg:px-6 bottom-0 max-lg:bottom-[70px] max-md:40 inset-x-0 transition-all duration-500 ${showQuickAdd ? "translate-y-0 p+opacity-100" : "translate-y-full opacity-0"} flex max-md:flex-col gap-y-4 items-center max-md:border-light-gray`}>
            <div className="flex items-center ml-auto gap-6 w-2/3">
                <img src={`${import.meta.env.VITE_API_BASE_URL}${product.images[0]}`} alt={product.name}
                     className="w-16 h-16 border border-light-gray rounded-sm"/>
                <div>
                    <h2 className="text-lg max-md:text-sm line-clamp-1">{product.name}</h2>
                    <div className="text-sm flex gap-2">
                        <p className="space-x-1">
                            <span>{priceFormater(product.discountPrice > 0 ? product.discountPrice : product.price)}</span><span>ت</span>
                        </p>
                        {product.discountPrice > 0 && <div className="space-x-1 flex">
                            <DiscountPrice discount={product.price}/>
                            <span className="text-dark-gray">ت</span>
                        </div>}
                        {product.discountPrice > 0 && <p className="flex gap-1 text-primary-blue">
                            <span>%{product.discountPercent}</span>
                            <span className="mt-px">تخفیف</span>
                        </p>}
                    </div>
                </div>
            </div>

            <div
                className="max-md:self-end w-full flex items-center gap-4 max-lg:text-sm">
                {variants.length > 0 &&
                    <div className="relative flex gap-2 items-center max-md:ml-auto max-md:self-tart md:mr-auto">
                        <label className="shrink-0 max-md:hidden">رنگ بندی:</label>
                        <select defaultValue="" onChange={(e) => onSelectValue(e.target.value)}
                                className="w-full appearance-none cursor-pointer outline-none border border-dark-gray rounded-lg text-sm py-2 px-3 pe-10">
                            <option value="" disabled>رنگ موردنظر</option>
                            {selectorOptions.map((o) => {
                                return (
                                    <option key={o.id} value={o.id}>{o.label}</option>)
                            })}
                        </select>
                        <svg className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
                             width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>}
                <div className={`flex items-center gap-4 ${variants.length === 0 ? "mr-auto" : ""}`}>
                    <button onClick={() => {
                        handleWishlist(product, isFavoriteProduct, selectedVariantId)
                    }}
                            className="relative border border-dark-gray p-2.5 py-2 rounded-lg cursor-pointer">
                        <ProductHeartIcon wishlistItems={wishlistItems} isFavoriteProduct={isFavoriteProduct}/>
                    </button>
                    {currentCartItem?.isInCart ? <UpdateQuantityWithDeleteBtn
                            className="border border-dark-gray py-2 outline-2 outline-primary-blue outline-offset-4"
                            onIncreaseQuantity={handleIncreaseQuantity}
                            onDecreaseQuantity={handleDecreaseQuantity}
                            quantity={quantity}
                            onQuantityChange={handleUpdateQuantity}
                            onUpdateCartQuantity={handleUpdateCartQuantity}
                            onRemoveItem={handleRemoveItem}/> :
                        <button onClick={handleAddToCart}
                                className="relative group isolate text-sm flex gap-1 items-center border border-dark-gray cursor-pointer text-dark-gray rounded-lg py-2 px-6 overflow-hidden hover:text-white transition-colors duration-800 after:transition-all after:duration-800 after:-z-10 after:content-[''] after:absolute after:top-0 after:right-0 after:w-0 after:h-full after:bg-primary-blue hover:after:w-full active:w-full">
                            <span className="no-wrap">افزودن به سبد خرید</span>
                            <svg className="group-hover:-translate-x-2 transition-transform duration-800"
                                 stroke="currentColor" fill="currentColor"
                                 strokeWidth="0" viewBox="0 0 24 24" height="1em"
                                 width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V15H18.4433L20.4433 7H8.00488V5H21.7241C22.2764 5 22.7241 5.44772 22.7241 6C22.7241 6.08176 22.7141 6.16322 22.6942 6.24254L20.1942 16.2425C20.083 16.6877 19.683 17 19.2241 17H5.00488C4.4526 17 4.00488 16.5523 4.00488 16ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z"></path>
                            </svg>
                        </button>
                    }
                </div>
            </div>
        </div>
    )
        ;
}

export default QuickAddProduct;