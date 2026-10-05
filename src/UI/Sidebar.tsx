import type {JSX, ReactNode} from 'react';
import {useAppSelector} from "../hooks/useAppSelector.ts";
import WishlistSidebarSummary from "../components/wishlist/WishlistSidebarSummary.tsx";
import CartSidebarSummary from "../components/cart/CartSidebarSummary.tsx";

interface SidebarProps {
    // Props here
    isOpen: boolean;
    children: ReactNode;
    asideName: string;
    onClose?: () => void;
}

function Sidebar({children, asideName, onClose, isOpen}: SidebarProps): JSX.Element {
    const activeSidebar = useAppSelector(state => state.ui.activeSidebar);

    return (
        <div className={`${isOpen ? "block" : "hidden"}`}>
            <div onClick={onClose} className="fixed inset-0 z-100 bg-black/50"/>
            <aside className="fixed top-0 right-0 h-screen w-1/2 max-md:w-2/3 lg:w-1/3 z-100 bg-white flex flex-col">
                <div
                    className="flex items-center justify-between shrink-0 bg-lightest-gray pr-6 pl-3.5 py-5 border-b border-light-gray">
                    <h2 className="text-[18px]">{asideName}</h2>
                    <button onClick={onClose} className="cursor-pointer">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
                             height="1.5em"
                             width="1.5em" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
                        </svg>
                    </button>
                </div>
                <div className="flex-1 min-h-0 px-4 overflow-y-auto custom-scrollbar">{children}</div>
                {activeSidebar === "wishlist" && (<WishlistSidebarSummary/>)}
                {activeSidebar === "cart" && (<CartSidebarSummary/>)}
            </aside>
        </div>
    );
}

export default Sidebar;