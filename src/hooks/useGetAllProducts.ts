import {useQuery} from "@tanstack/react-query";
import {getProducts} from "../api/products.ts";
import {useSearchParams} from "react-router";

export const useGetAllProducts = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");
    const category = searchParams.get("category");


    console.log("URL:", window.location.href);
    console.log("Query key:", keyword);

    return useQuery({
        queryKey: ["products", keyword, category],
        queryFn: () => getProducts(keyword, category),
    })
}