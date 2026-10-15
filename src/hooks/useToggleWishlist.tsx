import {useMutation} from "@tanstack/react-query";
import {toggleWishlist} from "../api/wishlist.ts";
import {setWishlist, toggleLocalWishlist} from "../store/wishlist/wishlistSlice.ts";
import {setSelectedProduct, showProductAlert} from "../store/ui/uiSlice.ts";
import {useAppSelector} from "./useAppSelector.ts";
import type {Product} from "../types/product.ts";
import {toast} from "sonner";
import {ApiError} from "../api/apiClient.ts";
import {useDispatch} from "react-redux";

function useToggleWishlist() {
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);

    const {mutateAsync} = useMutation({
        mutationFn: toggleWishlist,
        onSuccess: (data) => {
            dispatch(setWishlist(data.data.products));
        }
    })

    const handleWishlist = async (product: Product, isFavoriteProduct: boolean) => {
        if (isAuthenticated) {
            try {
                await mutateAsync(product._id);

                dispatch(setSelectedProduct(product));

                dispatch(showProductAlert({
                    productName: product.name,
                    productImage: product.images[0],
                    productId: product._id,
                    type: isFavoriteProduct ? "remove" : "add",
                }))
            } catch (err) {
                const error = err instanceof ApiError ? err.message : "خطا در حذف/اضافه کردن محصول به علاقه مندی";
                toast.error(error);
            }
        } else {
            dispatch(toggleLocalWishlist(product));
            dispatch(setSelectedProduct(product));

            dispatch(showProductAlert({
                productName: product.name,
                productImage: product.images[0],
                productId: product._id,
                type: isFavoriteProduct ? "remove" : "add",
            }))
        }
    }

    return {handleWishlist}
}

export default useToggleWishlist;
