import {type JSX} from 'react';
import {NavLink} from "react-router";
import * as React from "react";
import {useAppSelector} from "../hooks/useAppSelector.ts";

function MobileNavigation(): JSX.Element {
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const cart = useAppSelector(state => state.cart);
    const wishlistItems = useAppSelector(state => state.wishlist.items);

    const cartItems = isAuthenticated ? cart?.cart?.items : cart.localItems;

    const handleAnimate = (e: React.MouseEvent<HTMLLIElement>) => {
        const li = e.currentTarget;
        li.classList.remove("animate-nav-bg");
        void li.offsetWidth;
        li.classList.add("animate-nav-bg");
    }


    return (
        <nav className="fixed bottom-0 bg-white w-full lg:hidden border-t-2 border-light-gray z-50">
            <ul className="flex justify-between items-center w-full text-dark-gray px-1 text-sm">
                <li className="mobileNav-item" onClick={handleAnimate} onMouseEnter={handleAnimate}>
                    <NavLink to="/"
                             className={({isActive}) => `mobileNav-item-link ${isActive ? "text-primary-blue" : "text-dark-gray"} z-10`}>
                        <svg height="24" width="24" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16"
                                  stroke="currentColor"
                                  strokeWidth="1.5" strokeLinecap="round"/>
                            <path
                                d="M22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>خانه</span>
                    </NavLink>
                </li>
                <li className="mobileNav-item" onClick={handleAnimate} onMouseEnter={handleAnimate}>
                    <NavLink to="/categories"
                             className={({isActive}) => `mobileNav-item-link ${isActive ? "text-primary-blue" : "text-dark-gray"} z-10`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_429_11052)">
                                <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"/>
                                <circle cx="7" cy="17" r="3" stroke="currentColor" strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"/>
                                <path d="M14 14H20V19C20 19.5523 19.5523 20 19 20H15C14.4477 20 14 19.5523 14 19V14Z"
                                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                                <path d="M4 4H10V9C10 9.55228 9.55228 10 9 10H5C4.44772 10 4 9.55228 4 9V4Z"
                                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_429_11052">
                                    <rect width="24" height="24" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span>دسته بندی</span>
                    </NavLink>
                </li>
                <li className="mobileNav-item" onClick={handleAnimate} onMouseEnter={handleAnimate}>
                    <NavLink to="/wishlist"
                             className={({isActive}) => `mobileNav-item-link ${isActive ? "text-primary-blue" : "text-dark-gray"} z-10`}>
                        <div className="flex flex-col gap-2 items-center justify-center relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                 viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"/>
                            </svg>
                            <span>علاقه مندی</span>
                            <span aria-hidden={true}
                                  className={`bg-primary-red w-4.5 h-4 text-white absolute right-3 top-2.5 flex items-center justify-center rounded-sm leading-none ${wishlistItems?.length === 0 ? "hidden" : "block"}`}>{wishlistItems?.length}</span>

                        </div>
                    </NavLink>
                </li>
                <li className="mobileNav-item" onClick={handleAnimate} onMouseEnter={handleAnimate}>
                    <NavLink to="/cart"
                             className={({isActive}) => `mobileNav-item-link ${isActive ? "text-primary-blue" : "text-dark-gray"} z-10`}>
                        <div className="flex flex-col gap-2 items-center justify-center relative">
                            <svg aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                 viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"/>
                            </svg>
                            <span>سبد خرید</span>
                            <span aria-hidden={true}
                                  className={`bg-primary-red w-4.5 h-4 text-white absolute right-2 top-3 flex items-center justify-center rounded-sm leading-none ${cartItems?.length === 0 ? "hidden" : "block"}`}>{cartItems?.length}</span>

                        </div>
                    </NavLink>
                </li>
                <li className="mobileNav-item" onClick={handleAnimate} onMouseEnter={handleAnimate}>
                    <NavLink to={isAuthenticated ? "/dashboard" : "/auth"}
                             className={({isActive}) => `mobileNav-item-link ${isActive ? "text-primary-blue" : "text-dark-gray"} z-10`}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             width="24" height="24"
                             fill="none" viewBox="0 0 24 24">
                            <path
                                d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>پروفایل من</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
        ;
}

export default MobileNavigation;