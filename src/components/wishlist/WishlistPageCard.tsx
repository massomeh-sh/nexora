import {useMemo, useState} from 'react';
import type {Product} from "../../types/product.ts";
import StarRating from "../../UI/ProductRating.tsx";
import DiscountPrice from "../../UI/DiscountPrice.tsx";
import {priceFormater} from "@/utils/priceFormater.ts";
import {Link, useNavigate} from "react-router";
import {makeSelectIsInWishlist} from "../../store/wishlist/wishlistSlice.ts";
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import useToggleWishlist from "../../hooks/useToggleWishlist.tsx";
import {useDispatch} from "react-redux";
import {setSelectedProduct, showCartSidebar, showModal} from "../../store/ui/uiSlice.ts";
import {
    addLocalItem,
    makeSelectIsInCart,
} from "../../store/cart/cartSlice.ts";
import useAddToCart from "../../hooks/useAddToCart.ts";
import {useSelectedVariant} from "@/hooks/useSelectedVariant.ts";
import CloseIcon from "../../assets/icons/close.svg?react";
import {FiShoppingCart} from "react-icons/fi";


interface WishlistPageCartProps {
    // Props here
    product: Product;
}

function WishlistPageCard({product}: WishlistPageCartProps) {
    const [showOptions, setShowOptions] = useState(false);
    const selectIsInWishList = useMemo(() => makeSelectIsInWishlist(), []);
    const selectIsInCart = useMemo(() => makeSelectIsInCart(), []);
    const isFavoriteProduct = useAppSelector(state => selectIsInWishList(state, product._id));
    const {handleWishlist} = useToggleWishlist();
    const dispatch = useDispatch();
    const {mutate: addToCart} = useAddToCart();
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const navigate = useNavigate();


    const {displayProduct, variantId, setVariantId} = useSelectedVariant(product);
    const currentCartItem = useAppSelector(state => selectIsInCart(state, product._id, variantId));


    if (!displayProduct) return;

    const hasVariants = displayProduct?.variants?.length > 0;
    const productPath = `/product/${displayProduct.name}/?product_id=${displayProduct._id}`;

    const handleQuickView = async () => {
        await dispatch(setSelectedProduct(displayProduct));
        dispatch(showModal("quickView"));
    }

    const handleAddToCart = () => {
        if (isAuthenticated && !currentCartItem?.isInCart) {
            addToCart({productId: displayProduct._id, quantity: 1, variantId: variantId})
            dispatch(showCartSidebar());
        } else if (isAuthenticated && currentCartItem?.isInCart) navigate("/cart");

        if (!isAuthenticated && !currentCartItem?.isInCart) {
            dispatch(addLocalItem({product: displayProduct, quantity: 1}));
            dispatch(showCartSidebar());

        } else if (!isAuthenticated && currentCartItem?.isInCart) navigate("/cart");
    }


    const handleShowOptions = () => {
        setShowOptions(true);
    }

    return (
        <div
            className={`relative h-full w-full p-3 flex flex-col gap-1 ${!showOptions ? "group hover:shadow-[0_0_12px_rgba(0,0,0,0.20)]" : "overflow-hidden"} bg-white z-50`}>
            <div
                className={`absolute inset-0 transition-all duration-500 ease-in-out h-full w-full z-20 bg-white origin-center ${showOptions ? "opacity-100  scale-100 visible" : "scale-0 opacity-0 invisible pointer-events-none"}`}>
                <button onClick={() => setShowOptions(false)}
                        className="cursor-pointer bg-gray-400 text-white rounded-lg p-0.5 mt-10 mr-5">
                    <CloseIcon/>
                </button>

                <div className="flex flex-col gap-2 my-5 items-center justify-center text-sm">

                    <p className="text-dark-gray text-center text-lg">رنگ ها</p>

                    <div>
                        <div className="flex gap-3 flex-wrap items-center justify-center">
                            {displayProduct?.variants?.map((v) => (
                                <button onClick={() => setVariantId(v._id)} key={v._id}
                                        style={{backgroundColor: `${v.colorHex}`}}
                                        className={`px-5 py-2 text-white rounded-lg cursor-pointer ${v._id === variantId ? "ring-2 ring-offset-2 ring-primary-blue" : ""}`}>{v.colorName}</button>))}
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="flex items-center justify-center gap-2 cursor-pointer border border-primary-blue px-5 py-2.5 hover:bg-primary-blue transition-colors duration-300 hover:text-white rounded-lg mt-5 text-primary-blue">
                        <span>{currentCartItem?.isInCart ? "مشاهده سبد خرید" : "افزودن به سبد خرید"}</span>
                        <FiShoppingCart/>
                    </button>

                </div>

            </div>
            <div className="relative group overflow-hidden">
                <Link to={productPath}
                      className="block overflow-hidden bg-light-gray border border-light-gray">
                    <img className="w-full md:h-60 object-cover"
                         src={`${import.meta.env.VITE_API_BASE_URL}${displayProduct.images[0]}`}
                         alt={displayProduct.name}/>
                </Link>
                <button onClick={handleQuickView}
                        className="cursor-pointer absolute bg-white/80 w-[95%] py-1 rounded-sm max-lg:hidden border border-light-gray text-blue-900 text-center top-1/2 translate-y-4/2 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    مشاهده سریع محصول
                </button>
            </div>
            <Link to={productPath} className="text-sm text-dark-gray w-fit">{displayProduct.brand || "مشخص نشده"}</Link>
            <Link to={productPath} className="line-clamp-1 w-fit">{displayProduct.name}</Link>
            <StarRating productRating={displayProduct.rating}/>
            <div className="text-sm line-clamp-2">
                <div>
                    {displayProduct.discountPrice > 0 && <DiscountPrice discount={displayProduct.price}/>}
                    {!displayProduct.discountPrice &&
                        <p className="h-10"> {priceFormater(displayProduct.price)} تومان</p>}
                </div>
                {displayProduct.discountPrice > 0 &&
                    <p className="space-x-1">
                        <span>{priceFormater(displayProduct.discountPrice)}</span><span>تومان</span></p>}
            </div>
            <div
                className="flex items-center flex-wrap gap-3 mt-auto text-sm bg-white lg:absolute lg:shadow-sm lg:inset-x-0 lg:bottom-0 lg:px-3 lg:pb-3 lg:opacity-0 lg:group-hover:translate-y-full lg:z-10 lg:group-hover:opacity-100 lg:rounded-b-sm lg:transition-all lg:duration-1000">

                <button
                    onClick={hasVariants ? handleShowOptions : handleAddToCart}
                    className={`flex items-center justify-center flex-grow text-[10px] gap-2  px-3 py-2 2xl:text-sm text-xs rounded-sm cursor-pointer bg-primary-blue text-white`}>
                    <span>
                        {hasVariants ? "مشاهده گزینه ها" : currentCartItem?.isInCart ? "مشاهده سبد خرید" : "افزودن به سبد خرید"}
                    </span>
                    <FiShoppingCart/>
                </button>

                <button aria-label="افزودن به علاقه مندی ها"
                        className={`cursor-pointer w-5 h-5 lg:w-4 lg:h-4 ${isFavoriteProduct ? "text-primary-red favorite" : "text-current"}`}
                        onClick={() => {
                            handleWishlist(displayProduct, isFavoriteProduct, variantId)
                        }}>
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
                <button className="text-dark-gray hover:text-black cursor-pointer w-4 h-4">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8 20V21.9324C8 22.2086 7.77614 22.4324 7.5 22.4324C7.38303 22.4324 7.26977 22.3914 7.17991 22.3165L3.06093 18.8841C2.84879 18.7073 2.82013 18.392 2.99691 18.1799C3.09191 18.0659 3.23264 18 3.38103 18L18 18C19.1046 18 20 17.1045 20 16V7.99997H22V16C22 18.2091 20.2091 20 18 20H8ZM16 3.99997V2.0675C16 1.79136 16.2239 1.5675 16.5 1.5675C16.617 1.5675 16.7302 1.60851 16.8201 1.68339L20.9391 5.11587C21.1512 5.29266 21.1799 5.60794 21.0031 5.82008C20.9081 5.93407 20.7674 5.99998 20.619 5.99998L6 5.99997C4.89543 5.99997 4 6.8954 4 7.99997V16H2V7.99997C2 5.79083 3.79086 3.99997 6 3.99997H16Z"></path>
                    </svg>
                </button>
            </div>

        </div>
    );
}

export default WishlistPageCard;