import {removeItemFromWishlist} from "../api/wishlist.ts";
import {useMutation} from "@tanstack/react-query";
import {useDispatch} from "react-redux";
import {setWishlist} from "../store/wishlist/wishlistSlice.ts";
import {ApiError} from "../api/apiClient.ts";
import {toast} from "sonner";

function useRemoveItemFromWishlist() {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: removeItemFromWishlist,
        onSuccess: (data) => {
            dispatch(setWishlist(data.data.products));
        },
        onError: (error) => {
            const err = error instanceof ApiError ? error.message : "خطا در حذف محصول از علاقه مندی ها";
            toast.error(err);
        }
    })
}

export default useRemoveItemFromWishlist;