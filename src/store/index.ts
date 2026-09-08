import {configureStore} from "@reduxjs/toolkit";
import uiSliceReducer from "./ui/uiSlice.ts";
import wishlistReducer from "./wishlist/wishlistSlice.ts";

const store = configureStore({
    reducer: {ui: uiSliceReducer, wishlist: wishlistReducer},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;