import type {
    GetDealProductsResponse, GetProductByIdResponse,
    ReactToCommentResponse,
    ReactToProductCommentProps,
} from "../types/product.ts";
import {apiFetch} from "./apiClient.ts";

export async function getDeals(limit = 10): Promise<GetDealProductsResponse> {
    return apiFetch(`/api/products/deals?limit=${limit}`);
}

export async function getProduct(id: string): Promise<GetProductByIdResponse> {
    return apiFetch(`/api/products/${id}`);
}

export async function reactToProductComment({
                                                id,
                                                reviewId,
                                                type
                                            }: ReactToProductCommentProps): Promise<ReactToCommentResponse> {
    await new Promise((resolve) => {
        setTimeout(resolve, 500);
    });

    return apiFetch(`/api/products/${id}/reviews/${reviewId}/react`, {
        method: "POST",
        body: JSON.stringify({type}),
    });
}