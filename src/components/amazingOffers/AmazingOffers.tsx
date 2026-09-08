import OfferHeader from "./OfferHeader.tsx";
import OfferSlider from "./OfferSlider.tsx";
import {useQuery} from "@tanstack/react-query";
import {getDeals} from "../../api/products.ts";
import ProductCardSkeleton from "../../skeleton/ProductCardSkeleton.tsx";

function AmazingOffers() {
    const {data, isError, isLoading, error, refetch, isRefetching} = useQuery({
        queryKey: ["deal-products", {limit: 12}],
        queryFn: () => getDeals(12),
        retry: 2,
    });

    if (data?.data.length === 0 || !data) return null;


    return (
        <section
            className="flex max-lg:flex-col bg-gradient-to-l from-dark-blue to-primary-blue py-4 max-lg:py-0 max-lg:pb-4 max-lg:pr-3 max-lg:pl-0 rounded-2xl max-lg:rounded-none mt-10">
            {!isError && <OfferHeader/>}
            {isError && <div
                className="flex flex-col items-center justify-center bg-light-gray w-full ml-3 p-2 min-h-[300px] max-lg:min-h-[250px]">
                <p className="text-primary-red">{error.message}!</p>
                <button disabled={isRefetching} onClick={() => refetch()}
                        className="cursor-pointer">{isRefetching ? "در حال تلاش..." : "تلاش مجدد"}</button>
            </div>}
            {isLoading ? <div className="flex gap-2 w-full overflow-hidden">
                {Array.from({length: 5}).map((_, index) => (
                    <ProductCardSkeleton key={index}/>
                ))}
            </div> : <OfferSlider dealProducts={data.data}/>}
        </section>
    );
}

export default AmazingOffers;