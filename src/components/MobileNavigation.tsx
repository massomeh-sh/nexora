import {type JSX} from 'react';
import {NavLink} from "react-router";
import * as React from "react";
import {useAppSelector} from "../hooks/useAppSelector.ts";
import {mobileNavLinks} from "@/constants/mobileNavLinks.ts";

function MobileNavigation(): JSX.Element {
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const cart = useAppSelector(state => state.cart);

    const cartItems = isAuthenticated ? cart?.cart?.items : cart.localItems;

    const handleAnimate = (e: React.MouseEvent<HTMLLIElement>) => {
        const li = e.currentTarget;
        li.classList.remove("animate-nav-bg");
        void li.offsetWidth;
        li.classList.add("animate-nav-bg");
    }


    return (
        <nav className="fixed z-50 bottom-0 bg-white w-full lg:hidden border-t-2 border-light-gray">
            <ul className="flex justify-between items-center w-full text-dark-gray px-1 text-sm">
                {mobileNavLinks.map((l) => {
                    const Icon = l.icon;
                    return (
                        <li key={l.id} className="mobileNav-item" onClick={handleAnimate} onMouseEnter={handleAnimate}>
                            <NavLink to={l.id === "profile" && !isAuthenticated ? "/auth" : l.href}
                                     className={({isActive}) => `mobileNav-item-link relative ${isActive ? "text-primary-blue" : "text-dark-gray"} z-10`}>
                                <span className="relative">
                                    <Icon className="text-2xl"/>
                                     <span
                                         className={`${l.id === "cart" && cartItems?.length !== 0 ? "block w-5 text-center absolute -top-1 -left-2.5 rounded-full text-sm bg-primary-red text-white" : "hidden"}`}>{cartItems?.length}</span>
                                </span>
                                <span>{l.label}</span>
                            </NavLink>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
        ;
}

export default MobileNavigation;