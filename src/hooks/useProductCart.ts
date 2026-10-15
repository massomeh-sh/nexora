import {addLocalItem, makeSelectIsInCart} from "../store/cart/cartSlice.ts";
import {useAppSelector} from "./useAppSelector.ts";
import {useDispatch} from "react-redux";
import {useMemo} from "react";
import useAddToCart from "./useAddToCart.ts";
import type {Product} from "../types/product.ts";
import {showCartSidebar} from "../store/ui/uiSlice.ts";

export function useProductCart(product: Product) {
    const {mutate: mutateAddToCart} = useAddToCart();
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const dispatch = useDispatch();
    const selectIsInCart = useMemo(() => makeSelectIsInCart(), []);
    const currentCartItem = useAppSelector(state => selectIsInCart(state, product?._id || ""));
    const cart = useAppSelector(state => state.cart);
    const itemId = cart?.cart?.items.find((i) => i.product._id === product?._id)?._id || product?._id;

    const productQuantity = currentCartItem?.isInCart ? currentCartItem?.selectedItem.quantity : product?.quantity;

    const handleAddToCart = () => {
        if (isAuthenticated) {
            mutateAddToCart({productId: product._id, quantity: 1});
        } else {
            dispatch(addLocalItem({product, quantity: 1}));
        }
        dispatch(showCartSidebar());
    }

    return {itemId, productQuantity, handleAddToCart, currentCartItem, isAuthenticated};
}