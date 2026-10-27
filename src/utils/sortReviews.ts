import type {Product, ReviewSortType} from "../types/product.ts";

export function sortReviews(sortBy: ReviewSortType, product: Product) {
    return [...product.reviews].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }

        if (sortBy === "top") {
            return b.rating - a.rating;
        }

        return 0;
    });
}