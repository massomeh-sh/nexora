import type {ReviewSortOption} from "../types/product.ts";

export const reviewSortOptions: ReviewSortOption[] = [
    {id: 1, title: "جدید ترین", target: "newest"},
    {id: 2, title: "قدیمی ترین", target: "oldest"},
    {id: 3, title: "محبوب ترین", target: "top"}
]