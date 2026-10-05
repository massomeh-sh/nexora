import {type JSX, useMemo} from 'react';
import {Link, useNavigate} from "react-router";
import {priceFormater} from "../../util/priceFormater.ts";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import {addLocalItem, makeSelectIsInCart} from "../../store/cart/cartSlice.ts";
import type {Product} from "../../types/product.ts";
import useAddToCart from "../../hooks/useAddToCart.ts";
import {hideWishlistSidebar, setSelectedProduct, showConfirmationModal} from "../../store/ui/uiSlice.ts";

interface WishlistSidebarCardProps {
    // Props here
    product: Product;
}

function WishlistSidebarCard({
                                 product
                             }: WishlistSidebarCardProps): JSX.Element {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectIsInCart = useMemo(() => makeSelectIsInCart(), []);
    const currentCartItem = useAppSelector(state => selectIsInCart(state, product._id))
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);

    const {mutate: addToCart} = useAddToCart();

    const handleDeleteItem = () => {
        dispatch(setSelectedProduct(product));
        dispatch(showConfirmationModal("wishlist"));
    }

    const handleCart = () => {
        if (currentCartItem?.isInCart) {
            navigate("/cart");
            dispatch(hideWishlistSidebar());
        }

        if (isAuthenticated) {
            addToCart({productId: product._id, quantity: 1})
        } else {
            dispatch(addLocalItem({product: product, quantity: 1}))
        }
    }

    return (
        <div
            className='group flex items-start justify-center gap-3 w-full py-2 max-lg:text-sm'>
            <Link to={`/product/${product.name}/?product_id=${product._id}`}
                  className="w-1/3 h-full bg-light-gray border border-light-gray rounded-2xl overflow-hidden">
                <img src={`${import.meta.env.VITE_API_BASE_URL}${product.images[0]}`}
                     className="w-full h-full object-cover block transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110"/>
            </Link>
            <div className="flex flex-col w-full gap-1.5">
                <h3 className="line-clamp-2">{product.name}</h3>
                <div className="flex gap-1">
                    <p className="text-dark-gray relative">
                        <span>{priceFormater(product.price)}</span>
                        <span className="absolute top-3/5 left-0 -translate-y-1/2 w-full h-[1px] bg-dark-gray"/>
                    </p>
                    <p className="text-green-600 space-x-1">
                        <span>{priceFormater(product.discountPrice)}</span>
                        <span>تومان</span>
                    </p>
                </div>
                <button
                    onClick={handleCart}
                    className="relative ml-auto text-primary-red cursor-pointer after:absolute after:top-full after:right-0 after:w-0 after:h-[2px] after:bg-primary-red hover:after:w-full after:transition-all after:duration-300">{currentCartItem?.isInCart ? "مشاهده ی سبد خرید" : "افزودن به سبد خرید"}
                </button>
            </div>
            <button className="cursor-pointer mt-1 text-dark-gray"
                    onClick={handleDeleteItem}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.2em"
                     width="1.2em" xmlns="http://www.w3.org/2000/svg" className="__web-inspector-hide-shortcut__">
                    <path
                        d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                </svg>
            </button>
        </div>
    );
}

export default WishlistSidebarCard;