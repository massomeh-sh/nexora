import {type JSX, useEffect, useState} from 'react';
import type {Product} from "../../types/product.ts";
import UpdateQuantityWithDeleteBtn from "../../UI/UpdateQuantityWithDeleteBtn.tsx";
import {useProductCart} from "../../hooks/useProductCart.ts";
import {useCartQuantity} from "../../hooks/useCartQuantity.ts";
import DiscountPrice from "../../UI/DiscountPrice.tsx";
import {priceFormater} from "../../util/priceFormater.ts";

interface ProductQuickAddBarProps {
    // Props here
    product: Product
}

function ProductQuickAddBar({product}: ProductQuickAddBarProps): JSX.Element {
    const {productQuantity, isAuthenticated, itemId, currentCartItem, handleAddToCart} = useProductCart(product);
    const [showQuickAdd, setShowQuickAdd] = useState<boolean>(false);

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

    return (
        <div inert={!showQuickAdd} aria-hidden={!showQuickAdd}
             className={`fixed z-20 bg-linear-to-b from-white via-lightest-gray to-indigo-100 shadow-[0_0_2px_rgba(0,0,0,0.4)] w-full px-32 py-4 max-lg:px-6 bottom-0 max-lg:bottom-[70px] max-md:h-36 inset-x-0 transition-all duration-500 ${showQuickAdd ? "translate-y-0 p+opacity-100" : "translate-y-full opacity-0"} flex max-md:flex-col gap-y-4 items-center justify-between max-md:border-b-2 max-md:border-light-gray`}>
            <div className="flex items-center ml-auto gap-6">
                <img src={`${import.meta.env.VITE_API_BASE_URL}${product.images[0]}`} alt={product.name}
                     className="w-16 h-16 border border-light-gray rounded-sm"/>
                <div className="">
                    <h2 className="text-lg max-md:text-sm">{product.name}</h2>
                    <div className="text-sm flex gap-2">
                        <p className="space-x-1"><span>{priceFormater(product.discountPrice)}</span><span>ت</span></p>
                        <div className="space-x-1 flex">
                            <DiscountPrice discount={product.price}/>
                            <span className="text-dark-gray">ت</span>
                        </div>
                        <p className="flex gap-1 text-primary-blue">
                            <span>%{product.discountPercent}</span>
                            <span className="mt-px">تخفیف</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-md:self-end">
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
                        <span>افزودن به سبد خرید</span>
                        <svg className="group-hover:-translate-x-2 transition-transform duration-800" stroke="currentColor" fill="currentColor"
                             strokeWidth="0" viewBox="0 0 24 24" height="1em"
                             width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V15H18.4433L20.4433 7H8.00488V5H21.7241C22.2764 5 22.7241 5.44772 22.7241 6C22.7241 6.08176 22.7141 6.16322 22.6942 6.24254L20.1942 16.2425C20.083 16.6877 19.683 17 19.2241 17H5.00488C4.4526 17 4.00488 16.5523 4.00488 16ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z"></path>
                        </svg>
                    </button>}
            </div>
        </div>
    )
        ;
}

export default ProductQuickAddBar;