import {apiFetch} from "./apiClient.ts";
import type {GetCategoriesResponse} from "../types/product.ts";

export async function getCategories(): Promise<GetCategoriesResponse> {
    return apiFetch("/api/categories");
}