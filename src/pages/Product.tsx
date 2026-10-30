import {useSearchParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {productQuery} from "../api/productQueries.ts";
import ProductOrderDetails from "@/components/product/ProductOrderDetails.tsx";
import ProductOverview from "@/components/product/ProductOverview.tsx";
import QuickAddProduct from "@/components/product/QuickAddProduct.tsx";
import ProductDetails from "@/components/product/ProductDetails.tsx";
import BreadCrumbs from "@/UI/BreadCrumbs.tsx";
import type {BreadCrumbsItem} from "@/types/breadCrumbsItem.ts";
import {useCategories} from "@/hooks/useCategories.ts";
import {getCategoryChain} from "@/utils/getCategoryChain.ts";
import {useSelectedVariant} from "@/hooks/useSelectedVariant.ts";


function ProductPage() {
    const [searchParams] = useSearchParams();
    const productId = searchParams.get("product_id") || "";
    const {data} = useQuery(productQuery(productId));
    const {data: categoriesResponse} = useCategories();

    const product = data?.data;
    const categories = categoriesResponse?.data ?? [];
    const {variantId, setVariantId, displayProduct} = useSelectedVariant(product);


    if (!product || !displayProduct) return null;
    const shortName = product.name.length > 20 ? product.name.slice(0, 20) + "..." : product.name;

    const items: BreadCrumbsItem[] = [
        {label: "خانه", to: "/"},
        ...getCategoryChain(categories, product.category.slug).map((c) => ({
            label: c.name,
            to: `/products?category=${c.slug}`,
        })),
        {label: shortName}
    ]

    return (
        <section className="flex flex-col max-md:-mt-6">
            <BreadCrumbs items={items}/>
            <div className="flex flex-col md:flex-row gap-5">
                <ProductOverview product={displayProduct} selectedVariantId={variantId} onSelectValue={setVariantId}/>
                <ProductOrderDetails product={displayProduct}/>
                <QuickAddProduct product={displayProduct} onSelectValue={setVariantId} selectedVariantId={variantId}/>
            </div>
            <ProductDetails product={product}/>
        </section>
    )
        ;
}

export default ProductPage;