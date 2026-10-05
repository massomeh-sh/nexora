import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {Confirmation, uiState} from "./uiTypes.ts";

const initialState: uiState = {
    isQuickViewModalOpen: false,
    confirmationModal: null,
    isProductSharingModalOpen: false,
    selectedProduct: null,
    activeSidebar: null,

    productAlert: null,
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        showQuickViewModal: (state) => {
            state.isQuickViewModalOpen = true;
        },
        showProductSharingModal: (state) => {
            state.isProductSharingModalOpen = true;
        },
        hideProductSharingModal: (state) => {
            state.isProductSharingModalOpen = false;
        },
        showConfirmationModal: (state, action: PayloadAction<Confirmation>) => {
            state.confirmationModal = action.payload;
        },
        hideModal: (state) => {
            state.isQuickViewModalOpen = false;
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
    showQuickViewModal,
    showConfirmationModal,
    hideModal,
    showWishlistSidebar,
    hideWishlistSidebar,
    showCartSidebar,
    hideCartSidebar,
    setSelectedProduct,
    showProductAlert,
    hideProductAlert,
    showProductSharingModal,
    hideProductSharingModal
} = uiSlice.actions;

export default uiSlice.reducer;