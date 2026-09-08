import {type JSX, useEffect, useState} from 'react';
import {navLinks} from "../constants/navLinks.ts";
import {NavLink} from "react-router";
import CategoriesContainer from "./category-dropdown/CategoriesContainer.tsx";

function Navbar(): JSX.Element {
    const [showNav, setShowNav] = useState(true);
    const [showCategory, setShowCategory] = useState(false);

    useEffect(() => {
        let lastScroll = window.scrollY;
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > lastScroll && currentScroll >= 50) {
                setShowNav(false);
                setShowCategory(false);
            } else {
                setShowNav(true);
            }
            lastScroll = currentScroll;
        }

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);


    return (
        <>
            {showCategory && showNav && (
                <div className="fixed inset-0 bg-black/20"></div>
            )}
            <nav aria-label="منوی اصلی"
                 className={`relative bg-white px-32 border-b border-light-gray shadow-sm transition-all duration-500 ease-in-out ${showNav ? "translate-y-0" : "-translate-y-full"} max-lg:hidden`}>
                <div
                    className={`flex items-end justify-start gap-10 transition-all duration-1000 ${showNav ? "translate-y-0" : "-translate-y-full"}`}>
                    <div onMouseLeave={() => {
                        setShowCategory(false)
                    }}>
                        <div>
                            <button
                                aria-expanded={showCategory}
                                onMouseEnter={() => setShowCategory(true)}
                                className={`mr-6 font-medium cursor-pointer flex items-center gap-2 py-2 relative after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:bg-primary-blue after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full ${showCategory && "after:w-full"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none">
                                    <path d="M4 6H20M4 12H20M4 18H20" stroke="#000000" strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                                <span className="text-lg">دسته بندی کالاها</span>
                            </button>
                        </div>
                        {showNav && showCategory && (
                            <CategoriesContainer/>
                        )}
                    </div>
                    <span className="text-light-gray font-bold py-3">|</span>
                    <ul className="flex gap-15 text-dark-gray">
                        {navLinks.map((item) => <li key={item.id}><NavLink
                            className={({isActive}) => `flex items-center relative gap-2 py-2 after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-primary-blue after:transition-all after:duration-300 hover:after:w-full ${isActive ? "after:w-full" : ""}`}
                            to={item.href}><img className="mb-0.5"
                                                src={item.icon}
                                                alt={item.label}/><span>{item.label}</span></NavLink>
                        </li>)}
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default Navbar;