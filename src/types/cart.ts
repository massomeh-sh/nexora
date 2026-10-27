import type {Product} from "./product.ts";

export interface CartItem {
    _id: string;
    product: Product;
    quantity: number;
    price: number;
    variantId?: string | undefined;
}

export interface LocalCartItem {
    product: Product;
    quantity: number;
    variantId?: string | undefined;
}

export interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
}

export interface CartResponse {
    success: boolean;
    data: Cart;
}


export interface AddToCartParams {
    productId: string;
    quantity: number;
    variantId?: string | undefined;
}

export interface SelectableCartItem {
    product: Product;
    quantity: number;
    price?: number;
    _id?: string;
}