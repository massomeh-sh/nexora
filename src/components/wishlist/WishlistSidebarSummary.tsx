import type {JSX} from 'react';
import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import {hideWishlistSidebar} from "../../store/ui/uiSlice.ts";

function WishlistSidebarSummary(): JSX.Element {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleNavigateToWishlistPage = () => {
        navigate("/wishlist");
        dispatch(hideWishlistSidebar());
    }

    return (
        <div className="bg-lightest-gray px-5 py-5 shrink-0 border-t border-light-gray mt-auto space-y-3">
            <p>اکنون که محصولاتی را به فهرست
                علاقه‌مندی‌های خود اضافه کرده‌اید، فراموش نکنید که بعداً آن‌ها را به سبد خرید خود اضافه کنید.</p>
            <button onClick={handleNavigateToWishlistPage}
                    className="w-full block bg-darkest-gray p-2 text-white text-center hover:opacity-90 rounded-lg cursor-pointer">
                مشاهده ی علاقه مندی ها
            </button>
        </div>
    );
}

export default WishlistSidebarSummary;