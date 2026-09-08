import {BASE_URL} from "./apiClient.ts";
import type {GetDealProductsResponse} from "../types/product.ts";

export async function getDeals(limit = 10): Promise<GetDealProductsResponse> {
    const res = await fetch(`${BASE_URL}/api/products/deals?limit=${limit}`);
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData.message || "خظا در دریافت شگفت انگیز ها");
    }
    return res.json();
}