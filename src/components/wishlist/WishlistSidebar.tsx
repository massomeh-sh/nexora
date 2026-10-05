import {type JSX} from 'react';
import Sidebar from "../../UI/Sidebar.tsx";
import {useDispatch} from "react-redux";
import {hideWishlistSidebar} from "../../store/ui/uiSlice.ts";
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import WishlistSidebarCard from "../../UI/product/WishlistSidebarCard.tsx";
import {clearWishlist} from "../../api/wishlist.ts";
import {clearLocalWishlist} from "../../store/wishlist/wishlistSlice.ts";
import {useMutation} from "@tanstack/react-query";
import emptyWishlistSidebarImg from "../../assets/icons/empty-wishlist-sidebar.svg";
import {ApiError} from "../../api/apiClient.ts";
import {toast} from "sonner";


function WishlistSidebar(): JSX.Element {
    const activeSidebar = useAppSelector(state => state.ui.activeSidebar)
    const dispatch = useDispatch();
    const wishlistItems = useAppSelector(state => state.wishlist.items);
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);

    const {mutate} = useMutation({
        mutationFn: clearWishlist,
        onError: (error) => {
            const err = error instanceof ApiError ? error.message : "خطا در حذف محصولات مورد علاقه";
            toast.error(err);
        }
    });

    const handleClearWishlist = () => {
        if (isAuthenticated) {
            mutate();
        } else {
            dispatch(clearLocalWishlist());
        }
    }

    return (
        <Sidebar isOpen={activeSidebar === "wishlist"} asideName="علاقه مندی ها"
                 onClose={() => dispatch(hideWishlistSidebar())}>
            {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <img src={emptyWishlistSidebarImg} alt="هیچ علاقه مندی ندارید" className="w-52"/>
                    <p className="text-center mt-2">لیست محصولات مورد علاقه ی شما در حال حاضر خالی است.</p>
                </div>
            ) : (
                <>
                    {wishlistItems.length > 0 &&
                        <button onClick={handleClearWishlist}
                                className="cursor-pointer py-2 text-primary-blue hover:text-blue-700">حذف همه
                            موارد</button>
                    }
                    <ul>
                        {wishlistItems.map((item) => (
                            <li key={item._id} className="not-last:border-b not-last:border-light-gray">
                                <WishlistSidebarCard product={item}/>
                            </li>))}
                    </ul>
                </>)
            }
        </Sidebar>
    );
}

export default WishlistSidebar;