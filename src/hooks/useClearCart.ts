import {useMutation} from "@tanstack/react-query";
import {clearCart} from "../api/cart.ts";
import {ApiError} from "../api/apiClient.ts";
import {toast} from "sonner";

export function useClearCart() {
    return useMutation({
        mutationFn: clearCart,
        onError: (err) => {
            const error = err instanceof ApiError ? err.message : "خطا در حذف سبد خرید"
            toast.error(error)
        }
    })
}