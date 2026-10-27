import type {Product} from "@/types/product.ts";

export interface ProductAlertState {
    productName: string;
    productImage: string;
    productId: string;
    variantId?: string;
    type: "add" | "remove";
}

export interface uiState {
    currentModal: "quickView" | "shareLink" | null;
    currentBottomSheet: "sortReview" | null;
    confirmationModal: "cart" | "wishlist" | null;
    activeSidebar: "cart" | "wishlist" | "menu" | null;
    selectedProduct: Product | undefined;
    productAlert: ProductAlertState | null;
}


export type Confirmation = "cart" | "wishlist" | null;