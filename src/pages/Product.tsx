import {useSearchParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {productQuery} from "../api/productQueries.ts";
import type {Product} from "../types/product.ts";
import ProductOrderDetails from "../components/product/ProductOrderDetails.tsx";

function ProductPage() {
    const [searchParams] = useSearchParams();
    const productId = searchParams.get("product_id") || "";
    const {data} = useQuery(productQuery(productId));
    const product: Product = data?.data;
    if (!product) return null;

    return (
        <section className="flex flex-col 2xl:flex-row gap-5">
            <div className="bg-white rounded-lg lg:w-full px-6 py-7">right</div>
            <ProductOrderDetails product={product}/>
        </section>
    )
        ;
}

export default ProductPage;