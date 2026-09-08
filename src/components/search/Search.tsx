import {type JSX, type RefObject, useState} from 'react';
import TopSearches from "./TopSearches.tsx";
import searchBanner from "../../assets/بنر تبلیغاتی2.jpg";
import {Link} from "react-router";


interface SearchProps {
    openSearch: () => void;
    closeSearch: () => void;
    isSearchOpen: boolean;
    inputRef: RefObject<HTMLInputElement | null>;
}

function Search({openSearch, closeSearch, isSearchOpen, inputRef}: SearchProps): JSX.Element {
    const [searchText, setSearchText] = useState('');

    return (
        <form className="relative w-full flex items-center gap-5 max-lg:hidden">
            {isSearchOpen && <div
                onClick={() => {
                    closeSearch();
                    inputRef.current?.blur();
                }}
                className={`fixed inset-0 bg-black/30 z-10 transition-opacity duration-300`}>dd</div>}
            <div
                className={`relative z-30 bg-light-gray max-l:bg-white flex-1 min-w-0 h-11 rounded-full px-4 py-1 max-lg:hidden`}>
                <input autoComplete="off" ref={inputRef} onFocus={() => {
                    openSearch();
                    inputRef.current?.focus();
                }} type="text" placeholder="" value={searchText} onChange={(e) => setSearchText(e.target.value)}
                       className="w-full h-full peer outline-none pr-8"/>
                <p className="absolute inset-y-0 hidden right-12 top-1/2 -translate-y-1/2 text-dark-gray pointer-events-none lg:hidden">جستجو
                    &#32;در<span>{isSearchOpen ? "همه کالاها" :
                        <span className="text-primary-blue font-semibold">نکسورا</span>}</span></p>
                <p className="absolute inset-y-0 right-12 top-1/2 -translate-y-1/2 hidden lg:peer-placeholder-shown:block text-dark-gray pointer-events-none">
                    جستجو&nbsp;
                    {isSearchOpen ? "در همه کالاها" : ""}
                </p>
                <button type="button" onClick={() => inputRef.current?.focus()}
                        className="cursor-default">
                    <svg xmlns="http://www.w3.org/2000/svg"
                         className="w-6 h-6 text-dark-gray absolute top-1/2 -translate-y-1/2 right-4"
                         width="24" height="24"
                         fill="none" viewBox="0 0 24 24">
                        <path
                            d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <span
                    className="hidden peer-hover:block peer-focus:hidden bg-white px-2 py-1 text-darkest-gray rounded-lg text-xs  absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none max-lg:peer-hover:hidden">Ctrl+K</span>
            </div>
            {isSearchOpen && (
                <div onMouseDown={(e) => e.preventDefault()}
                     className="absolute inset-0 left-[-6px] right-[-6px] mt-2 min-h-80 bg-white rounded-3xl shadow-2xl p-5 z-20 mt-[-7px] max-lg:hidden">
                    <div className="mt-12 grid">
                        <TopSearches/>
                        <Link to="/category/fashion/women-clothing" className="block mt-3 w-full">
                            <img src={searchBanner} alt="بنر تبلیغاتی"
                                 className="object-cover w-full h-auto 2xl:h-40 rounded-sm"/>
                        </Link>
                    </div>
                </div>
            )}
        </form>
    );
}

export default Search;