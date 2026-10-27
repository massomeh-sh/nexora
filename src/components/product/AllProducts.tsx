import {type JSX, useEffect, useState} from 'react';
import type {GetAllProductsResponse, Product} from "@/types/product.ts";
import ProductResultCard from "../search/ProductResultCard.tsx";
import {useSearchParams} from "react-router";
import MobileResultCard from "@/components/search/MobileResultCard.tsx";
import {toast} from "sonner";
import ProductNotFount from "@/components/product/ProductNotFount.tsx";

interface AllProductsProps {
    // Props here
    responseData: GetAllProductsResponse;
}

function AllProducts({responseData}: AllProductsProps): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();

    const keyword = searchParams.get("keyword");
    const currentPage = Number(searchParams.get("page") || 1);
    const totalPages = responseData.pages;


    const [extraProducts, setExtraProducts] = useState<Product[]>([]);
    const [nextPage, setNextPage] = useState(currentPage + 1);
    const [loadingMore, setLoadingMore] = useState(false);


    useEffect(() => {
        setExtraProducts([]);
        setNextPage(currentPage + 1);
    }, [responseData, currentPage]);


    const hasMore = nextPage <= totalPages && !responseData.isFallback;


    const handleShowMore = async () => {
        setLoadingMore(true);
        try {
            const params = new URLSearchParams(searchParams);
            params.set("page", String(nextPage));

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products?${params}`);
            const json: GetAllProductsResponse = await res.json();

            setExtraProducts((prev) => {
                const ids = new Set(prev.map((p) => p._id));
                return [...prev, ...json.data.filter((p) => !ids.has(p._id))];
            });
            setNextPage((p) => p + 1);
        } catch (err) {
            toast.message(err instanceof Error ? err.message : "مشکلی در نمایش بیشتر محصول پیش آمد");
        } finally {
            setLoadingMore(false);
        }
    };

    const mobileProducts = [...responseData.data, ...extraProducts];

    const handlePageChange = (page: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", page);

        setSearchParams(newSearchParams);
    }

    return (
        <div className="md:bg-white h-full p-5 max-md:pt-0 rounded-lg">
            {responseData.isFallback && (
                <div role="status" className="bg-lightest-gray text-dark-gray rounded-lg p-4 mb-4 text-sm">
                    {keyword ? (
                        <p>برای «<strong>{keyword}</strong>» محصولی پیدا نشد. این محصولات ممکن است برایتان جالب باشند.
                        </p>
                    ) : (
                        <p>محصولی مطابق جستجوی شما پیدا نشد. این محصولات را پیشنهاد می‌دهیم.</p>
                    )}
                </div>
            )}
            {responseData.data.length === 0 && <ProductNotFount/>}
            <ul className="max-md:hidden grid md:grid-cols-3 lg:grid-cols-4">
                {responseData.data.map((p) => (<li key={p._id}><ProductResultCard product={p}/></li>))}
            </ul>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:hidden mt-5">
                {mobileProducts.map((p) => <li key={p._id}><MobileResultCard product={p}
                                                                             priority={p.images.length < 4}/></li>)}
            </ul>

            <div
                className={`max-md:hidden flex items-center justify-center gap-5 mt-5 ${totalPages <= 1 ? "hidden" : "block"}`}>
                <button onClick={() => handlePageChange(String(currentPage + 1))} aria-label="صفحه بعدی"
                        className={`${currentPage >= totalPages || responseData.data.length === 0 ? "cursor-default text-gray-300 shadow-[0_0_8px_rgba(0,0,0,0.2)]" : "cursor-pointer text-gray-500 shadow-[0_0_8px_rgba(39,115,219)]"} px-2 py-2 rounded-lg`}
                        disabled={currentPage >= totalPages || responseData.data.length === 0}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                         fill="none">
                        <path d="M10 16L14 12L10 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                </button>
                <span
                    className={`text-white px-3.5 py-1.5 rounded-lg cursor-default ${currentPage === totalPages ? "bg-primary-blue/50" : "bg-primary-blue"}`}>{currentPage}</span>
                <button disabled={currentPage === 1 || responseData.data.length === 0}
                        onClick={() => handlePageChange(String(currentPage - 1))} aria-label="صفحه قبلی"
                        className={`${currentPage === 1 ? "cursor-default text-gray-300 shadow-[0_0_8px_rgba(0,0,0,0.2)]" : "cursor-pointer text-gray-500 shadow-[0_0_8px_rgba(39,115,219)]"} bg-white px-2 py-2 rounded-lg`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                         fill="none">
                        <path d="M14 8L10 12L14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {hasMore ? <div className="flex items-center justify-center mt-5">
                <button disabled={loadingMore} onClick={handleShowMore}
                        className="md:hidden border-2 border-light-gray hover:bg-lightest-gray p-2 rounded-full text-sm cursor-pointer active:scale-90">
                    {loadingMore ? "در حال بارگذاری " : "نمایش بیشتر"}
                </button>
            </div> : (
                <p className="md:hidden text-center text-sm text-gray-500 mt-5">
                    همه‌ی محصولات نمایش داده شد
                </p>
            )}

        </div>
    );
}

export default AllProducts;