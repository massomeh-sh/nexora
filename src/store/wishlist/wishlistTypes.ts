import type {Product} from "../../types/product.ts";

export interface WishlistState {
    items: Product[];
    loading: boolean;
    error: string | null;
}