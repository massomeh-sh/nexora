import type {GetDealProductsResponse} from "../types/product.ts";
import {apiFetch} from "./apiClient.ts";

export async function getDeals(limit = 10): Promise<GetDealProductsResponse> {
    return apiFetch(`/api/products/deals?limit=${limit}`);
}

export async function getProduct(id: string) {
    return apiFetch(`/api/products/${id}`);
}