import {useMutation} from "@tanstack/react-query";
import {removeCartItem} from "../api/cart.ts";
import {ApiError} from "../api/apiClient.ts";
import {toast} from "sonner";

function useRemoveCartItem() {
    return useMutation({
        mutationFn: removeCartItem,
        mutationKey: ["cart"],
        onError: (err) => {
            const error = err instanceof ApiError ? err.message : "خطا در حذف محصول از سبد خرید"
            toast.error(error)
        }
    });
}


export default useRemoveCartItem;