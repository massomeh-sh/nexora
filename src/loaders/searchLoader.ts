import type {LoaderFunctionArgs} from "react-router";
import {getProducts} from "../api/products.ts";
import {queryClient} from "../routes/router.tsx";

export async function searchLoader({request}: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') ?? "";
    const category = url.searchParams.get('category') ?? "";
    const rating = url.searchParams.get('rating') ?? "";
    const minPrice = url.searchParams.get('minPrice') ?? "";
    const maxPrice = url.searchParams.get('maxPrice') ?? "";
    const page = url.searchParams.get('page') ?? "";
    const limit = url.searchParams.get('limit') ?? "";
    const sort = url.searchParams.get('sort') ?? "";

    const filters = {keyword, category, rating, minPrice, maxPrice, page, limit, sort};

    await queryClient.query({
        queryKey: ["products", keyword, category, rating, maxPrice, minPrice],
        queryFn: () => getProducts(filters)
    });

    return null;
}