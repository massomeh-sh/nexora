import type {Product} from "../../types/product.ts";

interface ProductAlertState {
    isOpen: boolean;
    productName: string;
    productImage: string;
    productId: string;
    type: "add" | "remove";
}

export interface uiState {
    currentModal: "quickView" | "shareLink" | null;
    confirmationModal: "cart" | "wishlist" | null;
    activeSidebar: "cart" | "wishlist" | "menu" | null;
    selectedProduct: Product | null;
    productAlert: ProductAlertState | null;
}


export type Confirmation = "cart" | "wishlist" | null;