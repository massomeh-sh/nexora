import {createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {CartState} from "./cartTypes.ts";
import type {Cart, LocalCartItem, SelectableCartItem} from "../../types/cart.ts";
import type {RootState} from "../index.ts";

const initialState: CartState = {
    localItems: [],
    cart: null,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<Cart>) => {
            state.localItems = [];
            state.cart = action.payload;
        },
        addLocalItem: (state, action: PayloadAction<LocalCartItem>) => {
            console.log("addLocalItem payload", action.payload.quantity, action.payload.product.stock);
            const existingItem = state.localItems.find((item) => item.product._id === action.payload.product._id);

            if (existingItem) {
                existingItem.quantity = action.payload.quantity;
            } else {
                state.localItems.push(action.payload);
            }
        },
        updateLocalItem: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
            const item = state.localItems.find((item) => item.product._id === action.payload.productId);
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },
        removeLocalItem: (state, action: PayloadAction<string>) => {
            state.localItems = state.localItems.filter((item) => item.product._id !== action.payload)
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

const selectedCartItem = (state: RootState, id: string): SelectableCartItem | undefined => {
    if (state.user.isAuthenticated) {
        return state.cart.cart?.items.find((item) => item.product._id === id);
    } else {
        return state.cart.localItems.find((it) => it.product._id === id);
    }
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