import {useQuery} from "@tanstack/react-query";
import {getProducts} from "../api/products.ts";
import {useSearchParams} from "react-router";

export const useGetAllProducts = () => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || "1";
    const keyword = searchParams.get("keyword") ?? "";
    const category = searchParams.get("category") ?? "";
    const rating = searchParams.get("rating") ?? "";
    const minPrice = searchParams.get("minPrice") ?? "";
    const maxPrice = searchParams.get("maxPrice") ?? "";
    const sort = searchParams.get("sort") ?? "";
    const limit = searchParams.get("limit") ?? "";


    const filters = {keyword, category, rating, minPrice, maxPrice, page, sort, limit};

    return useQuery({
        queryKey: ["products", keyword, category, rating, maxPrice, minPrice, page, sort, limit],
        queryFn: () => getProducts(filters),
    })
}