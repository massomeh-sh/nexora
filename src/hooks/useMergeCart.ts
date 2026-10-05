import {useMutation} from "@tanstack/react-query";
import {mergeCart} from "../api/cart.ts";
import {useDispatch} from "react-redux";
import {setCart} from "../store/cart/cartSlice.ts";
import {ApiError} from "../api/apiClient.ts";
import {toast} from "sonner";

function useMergeCart() {
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: mergeCart,
        onSuccess: (data) => {
            dispatch(setCart(data.data))
        },
        onError: (err) => {
            const error = err instanceof ApiError ? err.message : "خطا در اضافه کردن محصولات سبد خرید به حساب کاربری";
            toast.error(error);
        }
    });
}

export default useMergeCart;