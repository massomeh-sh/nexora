import {type JSX, useEffect, useRef, useState} from 'react';
import nexoraImage from "../assets/img/nexoraLogoImg.png";
import Navbar from "./Navbar.tsx";
import DesktopSearch from "./search/DesktopSearch.tsx";
import {Link} from "react-router";
import TopBanner from "./TopBanner.tsx";
import MobileSearchOverlay from "./search/MobileSearchOverlay.tsx";
import {useAppSelector} from "../hooks/useAppSelector.ts";
import {showCartSidebar, showMenuSidebar, showWishlistSidebar} from "../store/ui/uiSlice.ts";
import {useDispatch} from "react-redux";
import {useSearchOverlay} from "../hooks/useSearchOverlay.ts";
import {TbUser} from "react-icons/tb";
import {RiShoppingBasketLine} from "react-icons/ri";
import {HiOutlineHeart} from "react-icons/hi";


function Header(): JSX.Element {
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const dispatch = useDispatch();
    const wishlistItems = useAppSelector(state => state.wishlist.items);
    const cart = useAppSelector(state => state.cart);

    const cartItems = isAuthenticated ? cart?.cart?.items : cart.localItems;
    const {mobileSearchInputRef, desktopSearchInputRef, isSearchOpen, close, open} = useSearchOverlay();

    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const header = headerRef.current;

        if (!header) return;


        const updateHeaderHeight = () => {
            const height = header.getBoundingClientRect().height;

            document.documentElement.style.setProperty("--header-height", `${height}px`);
        }

        updateHeaderHeight();

        const observer = new ResizeObserver(() => {
            updateHeaderHeight();
        });

        observer.observe(header);

        return () => {
            observer.disconnect();
        }
    }, [])

    return (
        <>
            <div ref={headerRef} className="w-full flex flex-col sticky top-0 z-100">
                <TopBanner/>
                <header
                    className="flex items-center justify-between bg-primary-blue max-lg:px-6 max-lg:justify-start px-32 z-50">
                    <div className="flex justify-between items-center gap-5 max-lg:gap-0 w-1/2 max-lg:w-full">
                        <button onClick={() => dispatch(showMenuSidebar())}
                                className="lg:hidden cursor-pointer text-white">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
                                 height="28"
                                 width="28" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
                            </svg>
                        </button>
                        <Link to="/" className="mt-2">
                            <img src={nexoraImage} alt="صفحه ی اصلی نکسورا"
                                 className="w-48 h-16 max-lg:w-36 max-lg:h-12 mb-3 object-contain"/>
                        </Link>
                        <div className="lg:hidden flex gap-3 mr-auto">
                            <button onClick={() => {
                                open();
                                mobileSearchInputRef.current?.focus();
                            }} className="cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="text-white"
                                     width="22" height="22"
                                     fill="none" viewBox="0 0 24 24">
                                    <path
                                        d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <DesktopSearch inputRef={desktopSearchInputRef} isSearchOpen={isSearchOpen} close={close}
                                       open={open}/>
                    </div>
                    <div className="flex gap-6 max-lg:hidden">
                        <div onMouseEnter={() => setIsLoginDropdownOpen(true)}
                             onMouseLeave={() => setIsLoginDropdownOpen(false)} className="relative">
                            <Link to={`${isAuthenticated ? "dashboard" : "auth"}`}
                                  aria-label="حساب کاربری"
                                  className="cursor-pointer">
                                <TbUser className="text-3xl text-white"/>
                            </Link>
                            {isLoginDropdownOpen && !isAuthenticated && (
                                // You can also use border to create the triangle, or use svg to round it's top, up to you!
                                <>
                                    <div
                                        className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[20px] border-l-transparent border-r-transparent border-b-white">
                                    </div>
                                    <div
                                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 cursor-default">
                                        <ul className="bg-white flex flex-col items-center justify-center gap-2 py-3 px-5 rounded-sm shadow-sm w-[250px]">
                                            <li className="w-full">
                                                <Link to="auth"
                                                      className="w-full inline-block text-center bg-black text-white py-1 cursor-pointer rounded-sm">ورود
                                                    به حساب
                                                    کاربری
                                                </Link>
                                            </li>
                                            <li className="flex gap-2 text-sm">
                                                <span className="text-dark-gray">کاربر جدید هستید؟</span>
                                                <Link to="auth/signUp"
                                                      className="cursor-pointer underline underline-offset-4">ثبت نام
                                                    کنید.
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                        <button onClick={() => dispatch(showWishlistSidebar())} type="button" aria-label="علاقه مندی ها"
                                className="cursor-pointer relative">
                            <HiOutlineHeart className="text-3xl text-white"/>
                            <span
                                className={`bg-primary-red w-4.5 h-4 leading-none text-white absolute right-[-3px] bottom-[-3px] flex items-center justify-center rounded-sm ${wishlistItems?.length === 0 ? "hidden" : "block"}`}>{wishlistItems?.length}</span>
                        </button>
                        <button type="button" onClick={() => {
                            dispatch(showCartSidebar())
                        }} aria-label="سبد خرید"
                                className="cursor-pointer relative">
                            <RiShoppingBasketLine className="text-3xl text-white"/>
                            <span aria-hidden={true}
                                  className={`bg-primary-red w-4.5 h-4 text-white absolute right-[-3px] bottom-[-3px] flex items-center justify-center rounded-sm leading-none ${cartItems?.length === 0 ? "hidden" : "block"}`}>{cartItems?.length}</span>
                        </button>
                    </div>
                </header>
                <Navbar/>
            </div>
            <div
                className={`lg:hidden fixed inset-0 bg-white ${isSearchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"} transition-all duration-300 z-[999]`}>
                <MobileSearchOverlay inputRef={mobileSearchInputRef} closeSearch={close}/>
            </div>
        </>
    );
}

export default Header;