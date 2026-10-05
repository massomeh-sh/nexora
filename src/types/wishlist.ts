import type {Product} from "./product.ts";

interface WishlistData {
    id: string;
    user: string;
    products: Product[];
}

export interface WishlistResponse {
    success: boolean;
    data: WishlistData;
}