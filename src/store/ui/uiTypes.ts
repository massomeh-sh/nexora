import type {Product} from "../../types/product.ts";

export interface uiState {
    isModalOpen: boolean;
    isWishlistSidebarOpen: boolean;
    isCartSidebarOpen: boolean;
    selectedProduct: Product | null;
}