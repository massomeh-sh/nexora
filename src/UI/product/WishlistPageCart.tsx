import {type JSX, useMemo} from 'react';
import type {Product} from "../../types/product.ts";
import StarRating from "../StarRating.tsx";
import DiscountPrice from "../DiscountPrice.tsx";
import {priceFormater} from "../../util/priceFormater.ts";
import {Link, useNavigate} from "react-router";
import {makeSelectIsInWishlist} from "../../store/wishlist/wishlistSlice.ts";
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import useToggleWishlist from "../../hooks/useToggleWishlist.tsx";
import {useDispatch} from "react-redux";
import {setSelectedProduct, showCartSidebar, showQuickViewModal} from "../../store/ui/uiSlice.ts";
import {
    addLocalItem,
    makeSelectIsInCart,
} from "../../store/cart/cartSlice.ts";
import useAddToCart from "../../hooks/useAddToCart.ts";

interface WishlistPageCartProps {
    // Props here
    product: Product;
}

function WishlistPageCart({product}: WishlistPageCartProps): JSX.Element {
    const selectIsInWishList = useMemo(() => makeSelectIsInWishlist(), []);
    const selectIsInCart = useMemo(() => makeSelectIsInCart(), []);
    const isFavoriteProduct = useAppSelector(state => selectIsInWishList(state, product._id));
    const currentCartItem = useAppSelector(state => selectIsInCart(state, product._id))
    const {handleWishlist} = useToggleWishlist();
    const dispatch = useDispatch();
    const {mutate: addToCart} = useAddToCart();
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const navigate = useNavigate();

    const productPath = `/product/${product.name}/?product_id=${product._id}`;

    const handleQuickView = async () => {
        await dispatch(setSelectedProduct(product));
        dispatch(showQuickViewModal());
    }

    const handleAddToCart = () => {
        if (isAuthenticated && !currentCartItem?.isInCart) {
            addToCart({productId: product._id, quantity: 1})
            dispatch(showCartSidebar());
        } else if (isAuthenticated && currentCartItem?.isInCart) navigate("/cart");

        if (!isAuthenticated && !currentCartItem?.isInCart) {
            dispatch(addLocalItem({product, quantity: 1}));
            dispatch(showCartSidebar());

        } else if (!isAuthenticated && currentCartItem?.isInCart) navigate("/cart");
    }

    return (
        <div
            className="relative bg-white p-3 flex flex-col gap-1 group hover:shadow-[0_0_12px_rgba(0,0,0,0.20)] transition-all duration-500">
            <div className="relative group overflow-hidden">
                <Link to={productPath}
                      className="block overflow-hidden bg-light-gray border border-light-gray">
                    <img className="w-full h-full object-cover"
                         src={`${import.meta.env.VITE_API_BASE_URL}${product.images[0]}`} alt={product.name}/>
                </Link>
                <button onClick={handleQuickView}
                        className="cursor-pointer absolute bg-white/80 w-[95%] py-1 rounded-sm max-lg:hidden border border-light-gray text-blue-900 text-center top-1/2 translate-y-4/2 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    مشاهده سریع محصول
                </button>
            </div>
            <Link to={productPath} className="text-sm text-dark-gray w-fit">{product.brand || "مشخص نشده"}</Link>
            <Link to={productPath} className="line-clamp-1 w-fit">{product.name}</Link>
            <StarRating productRating={product.rating}/>
            <div className="text-sm line-clamp-2">
                <div>
                    <DiscountPrice discount={product.price}/>
                </div>
                <p className="space-x-1"><span>{priceFormater(product.discountPrice)}</span><span>تومان</span></p>
            </div>
            <div
                className="flex items-center flex-wrap gap-3 max-lg:mt-1 text-sm bg-white lg:absolute lg:shadow-sm lg:inset-x-0 lg:bottom-0 lg:px-3 lg:pb-3 lg:opacity-0 lg:group-hover:translate-y-full lg:z-10 lg:group-hover:opacity-100 lg:rounded-b-sm lg:transition-all lg:duration-1000">
                <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center flex-grow text-[10px] gap-2 bg-primary-blue px-3 py-2 2xl:text-sm text-xs rounded-sm text-white cursor-pointer">
                    <span>
                        {currentCartItem?.isInCart ? "مشاهده سبد خرید" : "افزودن به سبد خرید"}
                    </span>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
                         height="1em"
                         width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V15H18.4433L20.4433 7H8.00488V5H21.7241C22.2764 5 22.7241 5.44772 22.7241 6C22.7241 6.08176 22.7141 6.16322 22.6942 6.24254L20.1942 16.2425C20.083 16.6877 19.683 17 19.2241 17H5.00488C4.4526 17 4.00488 16.5523 4.00488 16ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z"></path>
                    </svg>
                </button>
                <button aria-label="افزودن به علاقه مندی ها"
                        className={`cursor-pointer w-5 h-5 lg:w-4 lg:h-4 ${isFavoriteProduct ? "text-primary-red favorite" : "text-current"}`}
                        onClick={() => handleWishlist(product, isFavoriteProduct)}>
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

export default WishlistPageCart;