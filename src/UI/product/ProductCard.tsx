import {type JSX, useMemo} from 'react';
import type {Product} from "../../types/product.ts";
import {Link} from "react-router";
import {priceFormater} from "../../util/priceFormater.ts";
import {setSelectedProduct, showModal} from "../../store/ui/uiSlice.ts";
import {makeSelectIsInWishlist} from "../../store/wishlist/wishlistSlice.ts";
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import useToggleWishlist from "../../hooks/useToggleWishlist.tsx";
import {useDispatch} from "react-redux";

interface ProductCardProps {
    // Props here
    product: Product;
}

function ProductCard({product}: ProductCardProps): JSX.Element {
    const dispatch = useDispatch();


    const selectIsInWishList = useMemo(() => makeSelectIsInWishlist(), []);
    // This will give us the selector we want and why we do this? Why don't we use the selector that is already in wishlistSlice and don't create different one? because we want a specific selector for each product so they don't overwrite the other selector cache!

    const isFavoriteProduct = useAppSelector(state => selectIsInWishList(state, product._id));

    const {handleWishlist} = useToggleWishlist();

    const handleQuickView = async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await dispatch(setSelectedProduct(product));
        dispatch(showModal("quickView"));
    }
    const handleCompare = () => {
    }

    return (
        <div
            className="relative min-w-[220px] max-lg:min-w-[150px] bg-lightest-gray p-4 max-lg:p-2 flex flex-col group">
            <Link draggable={false} to={`/product/${encodeURIComponent(product.name)}/?product_id=${product._id}`}
                  className="absolute inset-0 z-0"/>
            <div className="relative lg:overflow-hidden pointer-events-none">
                <img draggable={false} src={`${import.meta.env.VITE_API_BASE_URL}${product.images[0]}`}
                     alt={product.name}
                     className="w-full h-50 max-lg:h-25 object-contain select-none"/>
                <div dir="ltr"
                     className="absolute max-lg:translate-y-full bottom-0 inset-x-0 bg-lightest-gray/50 translate-y-full lg:group-hover:-translate-y-1.5 transition-transform duration-500 p-3 flex justify-center items-center gap-8 text-darkest-gray cursor-default border-b border-white max-lg:border-none pointer-events-auto">
                    <button aria-label="افزودن به علاقه مندی ها"
                            className={`cursor-pointer w-3 h-3 lg:w-4 lg:h-4 productCard-icon ${isFavoriteProduct ? "text-primary-red favorite" : "text-current"}`}
                            onClick={() => handleWishlist(product, isFavoriteProduct)}>
                        {isFavoriteProduct ? (
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <path
                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        )}
                    </button>
                    <button aria-label="نمایش سریع" className="cursor-pointer productCard-icon w-3 h-3 lg:w-4 lg:h-4"
                            onClick={handleQuickView}>
                        <svg stroke="currentColor" fill="currentColor"
                             strokeWidth="0"
                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
                        </svg>
                    </button>
                    <button aria-label="مقایسه" className="cursor-pointer productCard-icon w-3 h-3 lg:w-4 lg:h-4"
                            onClick={handleCompare}>
                        <svg stroke="currentColor" fill="currentColor"
                             strokeWidth="0"
                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 20V21.9324C8 22.2086 7.77614 22.4324 7.5 22.4324C7.38303 22.4324 7.26977 22.3914 7.17991 22.3165L3.06093 18.8841C2.84879 18.7073 2.82013 18.392 2.99691 18.1799C3.09191 18.0659 3.23264 18 3.38103 18L18 18C19.1046 18 20 17.1045 20 16V7.99997H22V16C22 18.2091 20.2091 20 18 20H8ZM16 3.99997V2.0675C16 1.79136 16.2239 1.5675 16.5 1.5675C16.617 1.5675 16.7302 1.60851 16.8201 1.68339L20.9391 5.11587C21.1512 5.29266 21.1799 5.60794 21.0031 5.82008C20.9081 5.93407 20.7674 5.99998 20.619 5.99998L6 5.99997C4.89543 5.99997 4 6.8954 4 7.99997V16H2V7.99997C2 5.79083 3.79086 3.99997 6 3.99997H16Z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <p className="line-clamp-2 mb-8 max-lg:mb-4 max-lg:text-sm max-lg:mt-10">
                {product.name}
            </p>
            <div dir="ltr" className="flex flex-col mt-auto max-lg:items-end">
                <div className="flex gap-2">
                    <span className="text-sm inline-block text-dark-gray relative">
                        {priceFormater(product.price)}
                        <span className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-px bg-dark-gray"/>
                    </span>
                    <span className="bg-primary-red text-white px-2 rounded-full max-lg:text-sm">
                    {Math.round(product.discountPercent)}%
                </span>
                </div>
                <p className="flex gap-2"><span>تومان</span><span>{priceFormater(product.discountPrice)}</span></p>
            </div>
        </div>);
}

export default ProductCard;