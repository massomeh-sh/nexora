import {useMutation} from "@tanstack/react-query";
import {addToCart} from "../api/cart.ts";
import {useDispatch} from "react-redux";
import {setCart} from "../store/cart/cartSlice.ts";
import {ApiError} from "../api/apiClient.ts";
import {toast} from "sonner";

function useAddToCart() {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: addToCart,
        onSuccess: (data) => {
            dispatch(setCart(data.data))
        },
        onError: (err) => {
            const error = err instanceof ApiError ? err.message : "خطا در اضافه کردن محصول به سبد خرید"
            toast.error(error)
        }
    })
}

export default useAddToCart;