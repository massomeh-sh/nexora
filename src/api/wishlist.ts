import {apiFetch} from "./apiClient.ts";
import type {WishlistResponse} from "../types/wishlist.ts";
import type {Product} from "../types/product.ts";

export function getWishlist(): Promise<WishlistResponse> {
    return apiFetch("/api/wishlist")
}

export function toggleWishlist(productId: string): Promise<WishlistResponse> {
    return apiFetch("/api/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({productId})
    })
}


export function addItemToWishlist(productId: string): Promise<WishlistResponse> {
    return apiFetch("/api/wishlist", {method: "POST", body: JSON.stringify({productId})})
}

export function removeItemFromWishlist(productId: string): Promise<WishlistResponse> {
    return apiFetch(`/api/wishlist/${productId}`, {method: "DELETE"})
}

export function mergeWishlist(items: Product[]): Promise<WishlistResponse> {
    return apiFetch("/api/wishlist/merge", {method: "POST", body: JSON.stringify({items})})
}

export function clearWishlist() {
    return apiFetch("/api/wishlist", {method: "DELETE"});
}