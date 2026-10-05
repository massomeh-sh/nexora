import {configureStore} from "@reduxjs/toolkit";
import uiSliceReducer from "./ui/uiSlice.ts";
import wishlistReducer from "./wishlist/wishlistSlice.ts";
import userReducer from "./user/userSlice.ts";
import cartReducer from "./cart/cartSlice.ts";

const savedWishlist = localStorage.getItem("wishlist");
const savedCart = localStorage.getItem("cart");

const store = configureStore({
        reducer: {ui: uiSliceReducer, wishlist: wishlistReducer, user: userReducer, cart: cartReducer},
        preloadedState: {
            wishlist: {
                items: savedWishlist ? JSON.parse(savedWishlist) : [],
            },
            cart: {
                localItems: savedCart ? JSON.parse(savedCart) : [],
                cart: null,
            }
        }
    })
;


store.subscribe(() => {
    const state = store.getState();

    // wishlist
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist.items));
    //cart
    localStorage.setItem("cart", JSON.stringify(state.cart.localItems));
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;