import {useEffect, useRef, useState} from "react";
import {updateLocalItem} from "../store/cart/cartSlice.ts";
import {setSelectedProduct, showConfirmationModal} from "../store/ui/uiSlice.ts";
import type {Product} from "../types/product.ts";
import useUpdateCartMutation from "./useUpdateCartMutation.ts";
import {useDispatch} from "react-redux";
import {toast} from "sonner";

export function useCartQuantity(productQuantity: number, isAuthenticated: boolean, itemId: string | undefined, product: Product) {
    const [inputQuantity, setInputQuantity] = useState(productQuantity || 1);
    const {mutate: mutateUpdateQuantity} = useUpdateCartMutation();
    const dispatch = useDispatch();
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

    useEffect(() => {
        setInputQuantity(productQuantity);
    }, [productQuantity])

    const updateQuantity = (quantity: number) => {
        if (timerRef.current) clearTimeout(timerRef.current);

        if (quantity === productQuantity) return;
        if (quantity > product.stock) {
            toast.error(
                product.stock === 0
                    ? "این محصول موجود نیست"
                    : `موجودی محصول کافی نیست (حداکثر ${product.stock} عدد)`
            );
            setInputQuantity(productQuantity);
            return;
        }

        if (isAuthenticated && itemId) {
            mutateUpdateQuantity({itemId, quantity});
        } else {
            dispatch(updateLocalItem({productId: product._id, quantity}));
        }
    }

    const handleIncreaseQuantity = () => {
        if (inputQuantity >= 99) return;
        updateQuantity(inputQuantity + 1)
    }

    const handleDecreaseQuantity = (): void => {
        if (inputQuantity === 1) {
            return;
        }
        updateQuantity(inputQuantity - 1)
    }

    const handleRemoveItem = () => {
        dispatch(setSelectedProduct(product));
        dispatch(showConfirmationModal("cart"));
    }


    const handleUpdateCartQuantity = (finalQuantity: number) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => updateQuantity(finalQuantity)
            , 400)
    }

    const handleUpdateQuantity = (newQuantity: number): void => {
        setInputQuantity(newQuantity);
    }

    return {
        inputQuantity,
        handleIncreaseQuantity,
        handleDecreaseQuantity,
        handleUpdateQuantity,
        handleUpdateCartQuantity,
        handleRemoveItem
    };

}