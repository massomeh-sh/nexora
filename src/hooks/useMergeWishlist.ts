import {useMutation} from "@tanstack/react-query";
import {mergeWishlist} from "../api/wishlist.ts";
import {ApiError} from "../api/apiClient.ts";
import {toast} from "sonner";

function useMergeWishlist() {
    return useMutation({
        mutationFn: mergeWishlist,
        onError: (error) => {
            const err = error instanceof ApiError ? error.message : "خطا در اضافه کردن محصولات مورد علاقه به حساب کاربری";
            toast.error(err);
        }
    })
}

export default useMergeWishlist;