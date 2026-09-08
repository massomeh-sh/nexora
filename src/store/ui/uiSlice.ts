import {createSlice} from "@reduxjs/toolkit";
import type {uiState} from "./uiTypes.ts";

const initialState: uiState = {
    isModalOpen: false,
    selectedProduct: null,
    isCartSidebarOpen: false,
    isWishlistSidebarOpen: false,
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        showModal: (state) => {
            state.isModalOpen = true;
        },
        hideModal: (state) => {
            state.isModalOpen = false;
        },
        showCartSidebar: (state) => {
            state.isCartSidebarOpen = true;
        },
        hideCartSidebar: (state) => {
            state.isCartSidebarOpen = false;
        },
        showWishlistSidebar: (state) => {
            state.isWishlistSidebarOpen = true;
        },
        hideWishlistSidebar: (state) => {
            state.isWishlistSidebarOpen = false;
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        }
    }
});


export const {
    showModal,
    hideModal,
    showWishlistSidebar,
    hideWishlistSidebar,
    showCartSidebar,
    hideCartSidebar,
    setSelectedProduct
} = uiSlice.actions;

export default uiSlice.reducer;