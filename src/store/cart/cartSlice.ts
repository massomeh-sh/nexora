import {createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {CartState} from "./cartTypes.ts";
import type {Cart, LocalCartItem, SelectableCartItem} from "../../types/cart.ts";
import type {RootState} from "../index.ts";

const initialState: CartState = {
    localItems: [],
    cart: null,
}

export const getItemVariantId = (item: SelectableCartItem): string | undefined => {
    const fromServer = (item as { variantId?: string | null }).variantId;
    return fromServer ?? item.product.selectedVariantId ?? undefined;
};

const isSameItem = (item: SelectableCartItem, productId: string, variantId?: string) =>
    item.product._id === productId && getItemVariantId(item) === (variantId ?? undefined);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<Cart>) => {
            state.localItems = [];
            state.cart = action.payload;
        },
        addLocalItem: (state, action: PayloadAction<LocalCartItem>) => {
            const {product} = action.payload;
            const existingItem = state.localItems.find((item) =>
                isSameItem(item, product._id, product.selectedVariantId)
            );

            if (existingItem) {
                existingItem.quantity = action.payload.quantity;
            } else {
                state.localItems.push(action.payload);
            }
        },
        updateLocalItem: (state, action: PayloadAction<{
            productId: string;
            variantId?: string;
            quantity: number
        }>) => {
            const item = state.localItems.find((it) =>
                isSameItem(it, action.payload.productId, action.payload.variantId)
            );
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },
        removeLocalItem: (state, action: PayloadAction<{ productId: string; variantId?: string }>) => {
            state.localItems = state.localItems.filter(
                (it) => !isSameItem(it, action.payload.productId, action.payload.variantId)
            );
        },
        clearLocalCart: (state) => {
            state.localItems = [];
        }
    }
});

const selectedCartItems = (state: RootState) => {
    if (state.user.isAuthenticated) {
        return state.cart?.cart?.items
    } else {
        return state.cart.localItems
    }
};

export const selectedCartSubTotal = createSelector([selectedCartItems], (items) => {
    if (!items) return;
    return items.reduce((total, item) => {
        return total + item.quantity * (item.product.discountPrice || item.product.price)
    }, 0);
});

const selectedCartItem = (state: RootState, id: string, variantId?: string): SelectableCartItem | undefined => {
    const items = state.user.isAuthenticated ? state.cart.cart?.items : state.cart.localItems;
    return items?.find((item) => isSameItem(item, id, variantId));
}

export const makeSelectProductQuantity = () => createSelector([selectedCartItem], (selectedItem) => {
    if (!selectedItem) return 1;
    return selectedItem.quantity;
});

export const makeSelectIsInCart = () => createSelector([selectedCartItem], (selectedItem) => {
    if (!selectedItem) return;
    return {selectedItem, isInCart: !!selectedItem};
});

export const {setCart, addLocalItem, updateLocalItem, removeLocalItem, clearLocalCart} = cartSlice.actions;

export default cartSlice.reducer;