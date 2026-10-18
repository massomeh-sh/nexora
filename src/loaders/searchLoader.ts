import type {LoaderFunctionArgs} from "react-router";
import {getProducts} from "../api/products.ts";
import {queryClient} from "../routes/router.tsx";

export async function searchLoader({request}: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');
    const category = url.searchParams.get('category');

    await queryClient.query({
        queryKey: ["products", keyword, category],
        queryFn: () => getProducts(keyword),
    });

    return null;
}