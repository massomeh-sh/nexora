import {useGetAllProducts} from "../hooks/useGetAllProducts.ts";
import {toast} from "sonner";
import ProductsFilter from "@/components/product/ProductsFilter.tsx";
import AllProducts from "@/components/product/AllProducts.tsx";
import {useEffect} from "react";
import ProductSkeleton from "@/components/product/ProductSkeleton.tsx";
import SortProducts from "@/components/product/SortProducts.tsx";
import {useSearchParams} from "react-router";
import type {BreadCrumbsItem} from "../types/breadCrumbsItem.ts";
import BreadCrumbs from "../UI/BreadCrumbs.tsx";
import {getCategoryChain} from "@/utils/getCategoryChain.ts";
import {useCategories} from "../hooks/useCategories.ts";
import MobileSortBar from "@/components/product/MobileSortBar.tsx";

function ProductsPage() {
    const [searchParams] = useSearchParams();
    const {data, isFetching, isError, error} = useGetAllProducts();
    const {data: categoriesResponse} = useCategories();

    const categories = categoriesResponse?.data ?? [];

    const category = searchParams.get("category") ?? "";
    const keyword = searchParams.get("keyword") ?? "";

    const items: BreadCrumbsItem[] = [
        {label: "خانه", to: "/"},
        {label: "محصولات", to: "/products"},
        ...getCategoryChain(categories, category).map((c) => ({
            label: c.name,
            to: `/products?category=${c.slug}`,
        }))
    ];


    if (keyword) items.push({label: `جستجو: ${keyword}`})

    useEffect(() => {
        if (isError) {
            toast.error(error.message)
        }
    }, [isError, error])

    return (
        <section className="flex flex-col max-md:bg-white max-md:-mx-6 max-md:-my-8">
            <div style={{top: "var(--header-height, 0px)"}}
                 className="max-md:sticky max-md:z-40 max-md:shadow-[0_4px_6px_-2px_rgba(0,0,0,0.1)]">
                <BreadCrumbs className="max-md:bg-white max-md:px-6" items={items}/>
                <MobileSortBar numProducts={data?.total}/>
            </div>
            <div className="grid grid-cols-[20%_1fr] max-2xl:grid-cols-1 gap-6">
                <ProductsFilter/>
                <div className="flex flex-col gap-4">
                    <SortProducts numProducts={data?.total}/>
                    {isFetching ? <ProductSkeleton/> : data && <AllProducts responseData={data}/>}
                </div>
            </div>
        </section>
    );
}

export default ProductsPage;