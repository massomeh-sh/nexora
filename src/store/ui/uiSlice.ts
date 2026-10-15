import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {Confirmation, uiState} from "./uiTypes.ts";

const initialState: uiState = {
    currentModal: null,
    confirmationModal: null,
    selectedProduct: null,
    activeSidebar: null,

    productAlert: null,
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        showModal: (state, action: PayloadAction<"quickView" | "shareLink">) => {
            state.currentModal = action.payload;
        },
        showConfirmationModal: (state, action: PayloadAction<Confirmation>) => {
            state.confirmationModal = action.payload;
        },
        hideModal: (state) => {
            state.currentModal = null;
            state.confirmationModal = null;
        },
        showCartSidebar: (state) => {
            state.activeSidebar = "cart";
        },
        hideCartSidebar: (state) => {
            state.activeSidebar = null;
        },
        showWishlistSidebar: (state) => {
            state.activeSidebar = "wishlist";
        },
        hideWishlistSidebar: (state) => {
            state.activeSidebar = null;
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = null;
            state.selectedProduct = action.payload;
        },
        showProductAlert: (state, action) => {
            state.productAlert = {
                ...action.payload,
            }
        },
        hideProductAlert: (state) => {
            state.productAlert = null
        }
    }
});


export const {
    showConfirmationModal,
    hideModal,
    showModal,
    showWishlistSidebar,
    hideWishlistSidebar,
    showCartSidebar,
    hideCartSidebar,
    setSelectedProduct,
    showProductAlert,
    hideProductAlert
} = uiSlice.actions;

export default uiSlice.reducer;