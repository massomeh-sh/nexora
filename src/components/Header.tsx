import {type JSX, useCallback, useEffect, useRef, useState} from 'react';
import nexoraImage from "../assets/img/nexoraLogoImg.png";
import Navbar from "./Navbar.tsx";
import Search from "./search/Search.tsx";
import {Link} from "react-router";
import TopBanner from "./TopBanner.tsx";
import MobileSearchOverlay from "./search/MobileSearchOverlay.tsx";
import {useAppSelector} from "../hooks/useAppSelector.ts";
import {useAppDispatch} from "../hooks/useAppDispatch.ts";
import {showCartSidebar, showWishlistSidebar} from "../store/ui/uiSlice.ts";

function Header(): JSX.Element {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const dispatch = useAppDispatch();
    const wishlistItems = useAppSelector(state => state.wishlist.items);
    const cart = useAppSelector(state => state.cart);

    const mobileSearchInputRef = useRef<HTMLInputElement | null>(null);
    const desktopSearchInputRef = useRef<HTMLInputElement | null>(null);

    const cartItems = isAuthenticated ? cart?.cart?.items : cart.localItems;


    const openSearch = () => {
        setIsSearchOpen(true);
        window.location.hash = "#search";
    }

    const closeSearch = useCallback(() => {
        setIsSearchOpen(false);
        if (window.location.hash === "#search") {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
    }, []);


    useEffect(() => {
        const handleHashChange = () => {
            setIsSearchOpen(window.location.hash === "#search");
        }
        handleHashChange();
        // We call it manually because it won't be called when component mount at first!

        window.addEventListener("hashchange", handleHashChange);

        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);


    useEffect(() => {
        if (!isSearchOpen) return;
        const closeSearchInput = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeSearch();
            }
            desktopSearchInputRef.current?.blur();
        }

        document.addEventListener("keydown", closeSearchInput);

        return () => {
            document.removeEventListener("keydown", closeSearchInput);
        }
    }, [isSearchOpen, closeSearch]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isShortcut =
                ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") ||
                e.key === "ن";

            if (!isShortcut) return;

            e.preventDefault();
            openSearch();
            desktopSearchInputRef.current?.focus();

            window.dispatchEvent(
                new CustomEvent("close-all-menus")
            );
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            <div className="w-full flex flex-col sticky top-0 z-100 max-lg:border-b max-lg:border-gray-300">
                <TopBanner/>
                <header
                    className="flex items-center justify-between bg-primary-blue max-lg:px-6 max-lg:justify-start px-32 z-50">
                    <div className="flex justify-between items-center gap-5 max-lg:gap-0 w-1/2 max-lg:w-full">
                        <button className="lg:hidden cursor-pointer text-white">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
                                 height="26"
                                 width="26" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
                            </svg>
                        </button>
                        <Link to="/" className="mt-2">
                            <img src={nexoraImage} alt="صفحه ی اصلی نکسورا"
                                 className="w-48 h-16 max-lg:w-36 max-lg:h-12 mb-3 object-contain"/>
                        </Link>
                        <div className="lg:hidden flex gap-3 mr-auto">
                            <button onClick={() => {
                                openSearch();
                                mobileSearchInputRef.current?.focus();
                            }} className="cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="text-white"
                                     width="26" height="26"
                                     fill="none" viewBox="0 0 24 24">
                                    <path
                                        d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <Search inputRef={desktopSearchInputRef} isSearchOpen={isSearchOpen} closeSearch={closeSearch}
                                openSearch={openSearch}/>
                    </div>
                    <div className="flex gap-6 max-lg:hidden">
                        <div onMouseEnter={() => setIsLoginDropdownOpen(true)}
                             onMouseLeave={() => setIsLoginDropdownOpen(false)} className="relative">
                            <Link to={`${isAuthenticated ? "dashboard" : "auth"}`}
                                  aria-label="حساب کاربری"
                                  className="cursor-pointer">
                                <svg aria-hidden={true} className="w-7 h-7 text-white"
                                     xmlns="http://www.w3.org/2000/svg"
                                     width="24" height="24"
                                     fill="none" viewBox="0 0 24 24">
                                    <path
                                        d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round"/>
                                </svg>
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
                            <svg aria-hidden={true} className="w-7 h-7  text-white"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                 viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"/>
                            </svg>
                            <span
                                className={`bg-primary-red w-4.5 h-4 leading-none text-white absolute right-[-3px] bottom-[-3px] flex items-center justify-center rounded-sm ${wishlistItems?.length === 0 ? "hidden" : "block"}`}>{wishlistItems?.length}</span>
                        </button>
                        <button type="button" onClick={() => {
                            dispatch(showCartSidebar())
                        }} aria-label="سبد خرید"
                                className="cursor-pointer relative">
                            <svg className="w-7 h-7 text-white" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                 viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"/>
                            </svg>
                            <span aria-hidden={true}
                                  className={`bg-primary-red w-4.5 h-4 text-white absolute right-[-3px] bottom-[-3px] flex items-center justify-center rounded-sm leading-none ${cartItems?.length === 0 ? "hidden" : "block"}`}>{cartItems?.length}</span>
                        </button>
                    </div>
                </header>
                <Navbar/>
            </div>
            <div
                className={`lg:hidden fixed inset-0 bg-white ${isSearchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"} transition-all duration-300 z-[999]`}>
                <MobileSearchOverlay inputRef={mobileSearchInputRef} closeSearch={closeSearch}/>
            </div>
        </>
    );
}

export default Header;