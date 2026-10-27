import type {
    CreateProductReviewProps, CreateProductReviewResponse,
    GetAllProductsResponse,
    GetDealProductsResponse, GetProductByIdResponse, ProductsQuery,
    ReactToCommentResponse,
    ReactToProductCommentProps,
} from "../types/product.ts";
import {apiFetch} from "./apiClient.ts";

export async function getDeals(limit = 10): Promise<GetDealProductsResponse> {
    return apiFetch(`/api/products/deals?limit=${limit}`);
}


export async function getProducts({
                                      keyword,
                                      category,
                                      rating,
                                      maxPrice,
                                      minPrice,
                                      page,
                                      sort,
                                      limit
                                  }: ProductsQuery): Promise<GetAllProductsResponse> {
    const params = new URLSearchParams();

    if (keyword) {
        params.set("keyword", keyword);
    }

    if (category) {
        params.set("category", category);
    }

    if (rating) {
        params.set("rating", rating);
    }

    if (maxPrice) {
        params.set("maxPrice", maxPrice);
    }

    if (minPrice) {
        params.set("minPrice", minPrice);
    }

    if (page) {
        params.set("page", page);
    }

    if (sort) {
        params.set("sort", sort);
    }

    if (limit) {
        params.set("limit", limit)
    }

    const url = params.size ? `/api/products?${params.toString()}` : "/api/products";
    return apiFetch(url);
}


export async function getProduct(id: string): Promise<GetProductByIdResponse> {
    return apiFetch(`/api/products/${id}`
    );
}

export async function reactToProductComment({
                                                id,
                                                reviewId,
                                                type
                                            }: ReactToProductCommentProps): Promise<ReactToCommentResponse> {
    await new Promise((resolve) => {
        setTimeout(resolve, 500);
    });

    return apiFetch(
        `/api/products/${id}/reviews/${reviewId}/react`, {
            method: "POST",
            body: JSON.stringify({type}),
        });
}


export async function createProductReview({
                                              productId,
                                              rating,
                                              comment,
                                              isAnonymous
                                          }: CreateProductReviewProps): Promise<CreateProductReviewResponse> {
    return apiFetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify({rating, comment, isAnonymous}),
    })
}