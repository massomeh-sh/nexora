import {queryOptions} from "@tanstack/react-query";
import {getProduct} from "./products.ts";

export const productQuery = (id: string) => {
    return queryOptions({
        queryKey: ["product", id],
        queryFn: () => getProduct(id)
    })
}