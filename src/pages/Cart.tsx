import {type JSX, useEffect, useRef, useState} from 'react';
import {Link} from "react-router";
import {useAppSelector} from "../hooks/useAppSelector.ts";
import CartPageCard from "../UI/product/CartPageCard.tsx";
import {useClearCart} from "../hooks/useClearCart.ts";
import {useDispatch} from "react-redux";
import {clearLocalCart, selectedCartSubTotal} from "../store/cart/cartSlice.ts";
import EmptyCartAndWishlist from "../UI/EmptyCartAndWishlist.tsx";
import emptyCart from "../assets/icons/empty-cart-page.svg";
import {priceFormater} from "../util/priceFormater.ts";


function CartPage(): JSX.Element {
    const [showDropdown, setShowDropDown] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const cart = useAppSelector(state => state.cart);
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const dispatch = useDispatch();

    const cartItems = (isAuthenticated ? cart?.cart?.items : cart.localItems) ?? [];
    const subTotal = useAppSelector(selectedCartSubTotal);

    const {mutate: mutateClearCart} = useClearCart();

    useEffect(() => {
        if (!showDropdown) return;

        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowDropDown(false);
            }
        }

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        }
    }, [showDropdown]);

    const handleClearCart = () => {
        if (isAuthenticated) {
            mutateClearCart();
        } else {
            dispatch(clearLocalCart());
        }
        setShowDropDown(false);
    }

    return (
        <section className="flex items-start max-2xl:flex-col gap-6">
            <div className="bg-white rounded-lg border border-gray-300 p-8 w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-3">
                        <p className="font-semibold text-lg">سبد خرید</p>
                        {cartItems.length > 0 &&
                            <p className="text-sm text-dark-gray flex items-center justify-center gap-1">
                                <span>{cartItems?.length}</span>
                                <span className="mt-0.5">کالا</span>
                            </p>
                        }</div>
                    <div ref={menuRef} dir="ltr" className="relative flex items-center gap-3">
                        {cartItems.length > 0 &&
                            <button onClick={() => setShowDropDown(true)} className="cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     fill="#000000" width="20" height="20" viewBox="0 0 32 32"
                                     enableBackground="new 0 0 32 32" id="Glyph" version="1.1">
                                    <path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z"
                                          id="XMLID_294_"/>
                                    <path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z"
                                          id="XMLID_295_"/>
                                    <path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z"
                                          id="XMLID_297_"/>
                                </svg>
                            </button>}
                        <Link to="/wishlist">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 height="24" width="24" version="1.1" id="Layer_1" viewBox="0 0 511.999 511.999">
                                <path style={{fill: "#2D527C"}}
                                      d="M343.567,410.466c-4.47,0-8.879-2.047-11.741-5.918c-4.786-6.478-3.414-15.609,3.064-20.394  c63.077-46.604,106.005-87.444,124.146-118.108c16.68-28.196,23.798-54.216,23.798-87.003c0-78.62-55.507-113.812-110.516-113.812  c-50.687,0-73.077,27.737-81.912,44.269c-3.137,5.87-9.229,9.52-15.901,9.525c-0.004,0-0.009,0-0.015,0  c-6.666,0-12.758-3.64-15.901-9.501c-8.869-16.543-31.33-44.294-82.106-44.294c-53.418,0-94.275,30.674-106.628,80.051  c-1.954,7.812-9.871,12.562-17.686,10.608c-7.813-1.954-12.563-9.874-10.608-17.686c15.522-62.047,68.481-102.14,134.922-102.14  c52.387,0,82.027,23.585,97.994,44.456c15.929-20.874,45.51-44.456,97.839-44.456c37.634,0,72.271,13.168,97.531,37.078  c27.575,26.1,42.15,62.719,42.15,105.899c0,37.869-8.594,69.28-27.861,101.852c-25.408,42.948-85.762,92.613-131.916,126.715  C349.614,409.537,346.577,410.466,343.567,410.466z"/>
                                <path style={{fill: "#CEE8FA"}}
                                      d="M95.706,207.913c37.86,0,54.846,21.221,61.531,33.685c0.84,1.565,3.118,1.563,3.955-0.003  c6.66-12.465,23.554-33.682,61.411-33.682c43.126,0,81.062,29.44,81.062,83.196c0,21.753-4.433,40.389-16.737,61.187  c-25.074,42.384-107.674,97.327-124.641,108.154c-1.875,1.197-4.251,1.2-6.131,0.007c-16.98-10.775-99.596-65.446-124.865-108.162  C18.985,331.5,14.583,312.863,14.583,291.11C14.583,237.353,52.581,207.913,95.706,207.913z"/>
                                <path style={{fill: "#2D527C"}}
                                      d="M159.214,475.934c-3.854,0-7.614-1.094-10.874-3.163c-10.277-6.52-101.237-65.101-129.602-113.048  C5.779,337.815,0,316.656,0,291.11c0-29.424,10.013-54.442,28.953-72.353c17.34-16.397,41.046-25.427,66.753-25.427  c32.228,0,52.05,13.542,63.494,26.08c11.421-12.541,31.209-26.08,63.403-26.08c25.704,0,49.401,9.031,66.727,25.431  c18.918,17.906,28.918,42.925,28.918,72.348c0,25.51-5.788,46.669-18.768,68.612c-28.158,47.597-119.073,106.466-129.347,113.021  C166.858,474.831,163.084,475.934,159.214,475.934z M95.706,222.496c-33.121,0-66.54,21.217-66.54,68.614  c0,20.296,4.389,36.375,14.675,53.762c19.338,32.69,79.443,76.929,115.357,100.213c34.049-22.242,95.997-67.793,115.177-100.213  c10.307-17.424,14.704-33.503,14.704-53.762c0-47.397-33.389-68.614-66.479-68.614c-28.657,0-42.219,14.123-48.549,25.972  c-2.927,5.48-8.614,8.887-14.839,8.887c-6.214,0-11.895-3.396-14.826-8.862C138.026,236.631,124.421,222.496,95.706,222.496z"/>
                            </svg>
                        </Link>
                        {showDropdown && (<ul dir="rtl"
                                              className="bg-white py-3 max-md:py-2 mt-1.5 absolute top-full left-0 w-xs max-sm:w-52 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.4)]">
                            <li className="text-sm">
                                <button onClick={handleClearCart}
                                        className="flex gap-4 items-center cursor-pointer w-full px-4 py-2 hover:bg-light-gray">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
                                         height="1.2em"
                                         width="1.2em" xmlns="http://www.w3.org/2000/svg"
                                         className="__web-inspector-hide-shortcut__">
                                        <path
                                            d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                                    </svg>
                                    <span>حذف همه</span>
                                </button>
                            </li>
                        </ul>)}
                    </div>
                </div>
                {!cartItems || cartItems.length === 0 && (
                    <EmptyCartAndWishlist image={emptyCart} description="لیست محصولات سبد خرید شما خالی است."
                                          title="سبد خرید خالی است"/>)}
                {cartItems.length > 0 && (
                    <ul className='flex flex-col gap-5 mt-15'>
                        {cartItems.map((item) => <li key={item.product._id} className="not-last:border-b not-last:pb-5 not-last:border-light-gray not-last:border-dashed"><CartPageCard cartItem={item}/></li>)}
                    </ul>
                )}
            </div>
            {cartItems.length > 0 && subTotal &&
                <div
                    className="2xl:sticky 2xl:top-[140px] flex flex-col gap-8 bg-white 2xl:w-1/3 border border-gray-300 rounded-lg p-8 h-fit max-2xl:w-full">
                    <h2 className="text-lg font-semibold">جزعیات پرداخت</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-dark-gray">
                            <div className="flex items-center gap-2">
                                <p>مجموع قیمت کالاها</p>
                                <p className="text-sm flex items-center justify-center gap-1 mb-1">
                                    <span>({cartItems?.length}</span>
                                    <span className="mt-0.5">کالا)</span>
                                </p>
                            </div>
                            <p className="text-sm flex items-center justify-center gap-1">
                                <span>{priceFormater(subTotal)}</span>
                                <span>تومان</span>
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <p>مجموع سبد خرید</p>
                            <p className="text-sm flex items-center justify-center gap-1">
                                <span>{priceFormater(subTotal)}</span>
                                <span>تومان</span>
                            </p>
                        </div>
                    </div>


                    <Link to="/checkout" className="bg-primary-blue rounded-lg text-white p-3 text-center">ثبت
                        سفارش</Link>

                    <p className="text-dark-gray text-sm flex items-center justify-center gap-1">
                        <svg className="self-start" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             viewBox="0 0 24 24"
                             fill="none">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM11.25 13.5V8.25H12.75V13.5H11.25ZM11.25 15.75V14.25H12.75V15.75H11.25Z"
                                  fill="currentColor"/>
                        </svg>
                        <span>مبلغ سفارش هنوز پرداخت نشده و‌ در صورت اتمام موجودی، کالاها از سبد حذف می‌شوند.</span>
                    </p>
                </div>}
        </section>
    )
        ;
}

export default CartPage;

