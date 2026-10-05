import {apiFetch} from "./apiClient.ts";
import type {AddToCartParams, CartResponse, LocalCartItem} from "../types/cart.ts";


export function mergeCart(items: LocalCartItem[]): Promise<CartResponse> {
    return apiFetch("/api/cart/merge", {method: "POST", body: JSON.stringify({items})})
}

export function getCart(): Promise<CartResponse> {
    return apiFetch("/api/cart")
}

export function addToCart({productId, quantity}: AddToCartParams): Promise<CartResponse> {
    return apiFetch("/api/cart", {method: "POST", body: JSON.stringify({productId, quantity})})
}

export function updateCartItem({itemId, quantity}: { itemId: string, quantity: number }): Promise<CartResponse> {
    return apiFetch(`/api/cart/${itemId}`, {method: "PUT", body: JSON.stringify({quantity})})
}

export function removeCartItem(itemId: string): Promise<CartResponse> {
    return apiFetch(`/api/cart/${itemId}`, {method: "DELETE"})
}

export function clearCart(): Promise<CartResponse> {
    return apiFetch("/api/cart", {method: "DELETE"})
}