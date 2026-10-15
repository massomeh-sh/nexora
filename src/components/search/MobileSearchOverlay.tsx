import {type JSX, type RefObject, useEffect, useRef, useState} from 'react';
import {categories} from "../../constants/categories-dropdown.ts";
import TopSearches from "./TopSearches.tsx";
import searchBanner from "../../assets/بنر تبلیغاتی2.jpg";
import {Link} from "react-router";

interface MobileSearchOverlayProps {
    closeSearch: () => void;
    inputRef: RefObject<HTMLInputElement | null>;
}

function MobileSearchOverlay({closeSearch, inputRef}: MobileSearchOverlayProps): JSX.Element {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("همه دسته بندی ها");
    const searchCategoryRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (searchCategoryRef.current && !searchCategoryRef.current.contains(e.target as Node)) {
                setOpenDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    return (
        <div className="px-10 py-5 flex flex-col gap-5">
            <div className="flex relative">
                <form ref={searchCategoryRef} className="relative w-1/3 bg-light-gray rounded-r-sm">
                    <button onClick={() => setOpenDropdown((pre) => !pre)}
                            className="text-sm text-dark-gray flex gap-2 items-center cursor-pointer px-3 py-4 w-full">
                        <span className="text-xs">{selectedCategory}</span>
                        <svg
                            className="w-4 h-4 mr-auto"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="m6 9 6 6 6-6"/>
                        </svg>
                    </button>
                    {openDropdown &&
                        <ul className="absolute w-full right-0 top-full bg-white border border-light-gray shadow-sm overflow-y-auto text-dark-gray text-sm max-h-[250px]">
                            <li onClick={() => {
                                setSelectedCategory("همه دسته بندی ها");
                                setOpenDropdown(false);
                            }}
                                className={`cursor-pointer active:bg-light-gray ${selectedCategory === "همه دسته بندی ها" ? "bg-light-gray" : "hover:bg-light-gray"}  hover:bg-lightest-gray py-3 px-2`}>
                                <button
                                    className={`pointer-events-none text-xs`}>همه
                                    دسته بندی ها
                                </button>
                            </li>
                            {categories.map((category) => <li key={category.id} onClick={() => {
                                setSelectedCategory(category.name);
                                setOpenDropdown(false);
                            }}
                                                              className={`cursor-pointer active:bg-light-gray ${selectedCategory === category.name ? "bg-light-gray" : "hover:bg-light-gray"} py-3 px-2`}>
                                <button
                                    className="cursor-pointer text-xs">{category.name}</button>
                            </li>)}
                        </ul>}
                </form>
                <input ref={inputRef} autoComplete="off" type="text" placeholder="جستجو در همه کالاها..."
                       className="bg-lightest-gray flex-1 rounded-l-sm outline-none pr-3"/>
                <button onClick={() => {
                    closeSearch();

                }} className="cursor-pointer text-dark-gray">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="18"
                         className="absolute top-1/2 -translate-y-1/2 left-3"
                         width="18" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
                    </svg>
                </button>
            </div>


            <div className="border border-light-gray p-3 flex flex-col">
                <TopSearches/>
                <div className="bg-light-gray h-[1px] w-full my-4"/>
                <Link to="/category/fashion/women-clothing" className="block mt-3 w-full">
                    <img src={searchBanner} alt="بنر تبلیغاتی"
                         className="object-cover w-full h-auto 2xl:h-40 rounded-sm"/>
                </Link>
            </div>
        </div>
    );
}

export default MobileSearchOverlay;