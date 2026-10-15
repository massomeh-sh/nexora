import {useSearchParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {productQuery} from "../api/productQueries.ts";
import ProductOrderDetails from "../components/product/ProductOrderDetails.tsx";
import ProductOverview from "../components/product/ProductOverview.tsx";
import ProductQuickAddBar from "../components/product/ProductQuickAddBar.tsx";
import ProductDetails from "../components/product/ProductDetails.tsx";

function ProductPage() {
    const [searchParams] = useSearchParams();
    const productId = searchParams.get("product_id") || "";
    const {data} = useQuery(productQuery(productId));
    const product = data?.data;

    if (!product) return null;

    return (
        <section className="flex flex-col">
            <div className="flex flex-col md:flex-row gap-5">
                <ProductOverview product={product}/>
                <ProductOrderDetails product={product}/>
                <ProductQuickAddBar product={product}/>
            </div>
            <ProductDetails product={product}/>
        </section>
    )
        ;
}

export default ProductPage;