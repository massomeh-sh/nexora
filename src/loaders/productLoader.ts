import {getProduct} from "../api/products.ts";
import type {LoaderFunctionArgs} from "react-router";
import {queryClient} from "../routes/router.tsx";

export async function productLoader({request}: LoaderFunctionArgs) {
    const id = new URL(request.url).searchParams.get('product_id') ?? "";
    await queryClient.query({
        queryKey: [{id}],
        queryFn: () => getProduct(id),
        staleTime: "static",
    });

    return null;
}