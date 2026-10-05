import {createSelector, createSlice} from "@reduxjs/toolkit";
import type {WishlistState} from "./wishlistTypes.ts";
import type {RootState} from "../index.ts";
import type {Product} from "../../types/product.ts";

const initialState: WishlistState = {
    items: []
}

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        toggleLocalWishlist(state, action) {
            const exist = state.items.some((item) => item._id === action.payload._id);

            if (exist) {
                state.items = state.items.filter((item) => item._id !== action.payload._id);
            } else {
                state.items.push(action.payload);
            }
        },
        addLocalToWishlist(state, action) {
            const exist = state.items.find((it) => it._id === action.payload._id);
            if (exist) return;
            state.items.push(action.payload);
        },
        removeLocalFromWishlist(state, action) {
            state.items = state.items.filter((item) => item._id !== action.payload);
        },
        setWishlist(state, action) {
            state.items = action.payload;
        },
        clearLocalWishlist(state) {
            state.items = []
        }
    }
});


const wishlistItems = (state: RootState) => state.wishlist.items;

export const makeSelectIsInWishlist = () => createSelector([wishlistItems, (_state: RootState, productId: string) => productId], (wishlistItems: Product[], productId) => {
    return wishlistItems.some(((item) => item._id === productId));
})

export const {
    toggleLocalWishlist,
    addLocalToWishlist,
    removeLocalFromWishlist,
    setWishlist,
    clearLocalWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;