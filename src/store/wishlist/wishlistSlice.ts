import {createSelector, createSlice} from "@reduxjs/toolkit";
import type {WishlistState} from "./wishlistTypes.ts";
import type {RootState} from "../index.ts";
import type {Product} from "../../types/product.ts";

const initialState: WishlistState = {
    items: [],
    loading: false,
    error: null
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
        addToWishlist(state, action) {
            state.items.push(action.payload);
        },
        removeFromWishlist(state, action) {
            state.items = state.items.filter((item) => item._id !== action.payload._id);
        }
    }
});


const wishlistItems = (state: RootState) => state.wishlist.items;

export const itemIsInWishlist = () => createSelector([wishlistItems, (_state: RootState, productId: string) => productId], (wishlistItems: Product[], productId) => {
    return wishlistItems.some(((item) => item._id === productId));
})

export const {toggleLocalWishlist, addToWishlist, removeFromWishlist} = wishlistSlice.actions;

export default wishlistSlice.reducer;