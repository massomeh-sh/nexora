import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {Confirmation, ProductAlertState, uiState} from "./uiTypes.ts";

const initialState: uiState = {
    currentModal: null,
    currentBottomSheet: null,
    confirmationModal: null,
    selectedProduct: undefined,
    activeSidebar: null,

    productAlert: null,
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        showBottomSheet: (state, action: PayloadAction<"sortReview">) => {
            state.currentBottomSheet = action.payload;
        },
        hideBottomSheet: (state) => {
            state.currentBottomSheet = null;
        },
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
        showMenuSidebar: (state) => {
            state.activeSidebar = "menu";
        },
        hideMenuSidebar: (state) => {
            state.activeSidebar = null;
        },
        showWishlistSidebar: (state) => {
            state.activeSidebar = "wishlist";
        },
        hideWishlistSidebar: (state) => {
            state.activeSidebar = null;
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = undefined;
            state.selectedProduct = action.payload;
        },
        showProductAlert: (state, action: PayloadAction<ProductAlertState>) => {
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
    showBottomSheet,
    hideBottomSheet,
    showWishlistSidebar,
    hideWishlistSidebar,
    showCartSidebar,
    hideCartSidebar,
    setSelectedProduct,
    showProductAlert,
    hideProductAlert,
    showMenuSidebar,
    hideMenuSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;