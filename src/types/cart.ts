import type {Product} from "./product.ts";

export interface CartItem {
    _id: string;
    product: Product;
    quantity: number;
    price: number;
}

export interface LocalCartItem {
    product: Product;
    quantity: number;
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
}

export interface SelectableCartItem {
    product: Product;
    quantity: number;
    price?: number;
    _id?: string;
}