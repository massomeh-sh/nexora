import {type JSX, useEffect, useState} from 'react';
import BottomSheet from "@/UI/BottomSheet.tsx";
import BottomSheetHeader from "@/UI/BottomSheetHeader.tsx";
import {useSheetRoute} from "@/hooks/useSheetRoute.ts";
import {useLockBodyScroll} from "@/hooks/useLockBodyScroll.ts";
import {useSearchParams} from "react-router";

const MAX_PRICE = 10_000_000;

interface FilterDraft {
    rating: string,
    minPrice: number,
    maxPrice: number,
}

const DEFAULT_FILTERS: FilterDraft = {
    rating: "",
    minPrice: 0,
    maxPrice: MAX_PRICE,
}


const SUGGESTED_PRICES = [
    {label: "زیر 500 هزار تومان", min: 0, max: 500_000},
    {label: "تا 2.5 میلیون", min: 500_000, max: 2_500_000},
    {label: "بالای 2.5 میلیون", min: 2_500_000, max: MAX_PRICE},
]


const getFiltersFromParams = (params: URLSearchParams): FilterDraft => ({
    rating: params.get("rating") ?? DEFAULT_FILTERS.rating,
    minPrice: Number(params.get("minPrice") ?? DEFAULT_FILTERS.minPrice),
    maxPrice: Number(params.get("maxPrice") ?? DEFAULT_FILTERS.maxPrice),
})

function FilterBottomSheet(): JSX.Element {
    const {isOpen, close} = useSheetRoute("filterProducts");
    const [filters, setFilters] = useState<FilterDraft>(DEFAULT_FILTERS);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (isOpen) {
            setFilters(getFiltersFromParams(searchParams));
        }
    }, [isOpen, searchParams]);

    useLockBodyScroll(isOpen);

    const handleRatingChange = (value: string) => {
        setFilters((prevState) => ({...prevState, rating: value}))
    }

    const minPercent = (filters.minPrice / MAX_PRICE) * 100;
    const maxPercent = (filters.maxPrice / MAX_PRICE) * 100;

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams);

        if (filters.rating) {
            params.set("rating", filters.rating);
        } else {
            params.delete("rating");
        }


        if (filters.minPrice) {
            params.set("minPrice", String(filters.minPrice))
        } else {
            params.delete("minPrice");
        }

        if (filters.maxPrice) {
            params.set("maxPrice", String(filters.maxPrice))
        } else {
            params.delete("maxPrice");
        }

        params.delete("page");
        setSearchParams(params);
    }


    return (
        <BottomSheet close={close} isOpen={isOpen} collapsed={0.6}
                     header={<BottomSheetHeader close={close} title="فیلتر ها"/>}>
            <div className="px-4 flex flex-col">


                <div className="border-b border-light-gray py-3">
                    <h2 className="font-semibold">امتیاز کاربران</h2>
                    <div className="mt-2">
                        {Array.from({length: 3}).map((_, index) => {
                            const count = 4 - index;

                            return (
                                <label key={count} className="flex items-center gap-5 cursor-pointer">
                                    <input type="radio" name="rating" value={count}
                                           checked={filters.rating === String(count)}
                                           onChange={(e) => handleRatingChange(String((e.target.value)))}
                                           className="size-4"/>
                                    <p>
                                        <span>{count}</span>
                                        <span>و بالاتر </span>
                                    </p>
                                </label>
                            )
                        })}
                    </div>
                </div>


                <div className="py-3 border-b border-light-gray flex flex-col gap-4">
                    <h2 className="font-semibold">محدوده قیمت</h2>

                    <div className="flex items-center gap-2">

                        <label htmlFor="from-x" className="text-dark-gray">از:</label>
                        <input id="from-x" type="number" min={0} max={filters.maxPrice} value={filters.minPrice}
                               onChange={(e) => setFilters((pre) => ({
                                   ...pre,
                                   minPrice: Math.min(Number(e.target.value), MAX_PRICE)
                               }))}
                               className="filter-input" required/>

                        <label htmlFor="to-x" className="text-dark-gray">تا:</label>
                        <input id="to-x" type="number" min={filters.minPrice} max={MAX_PRICE} value={filters.maxPrice}
                               onChange={(e) => setFilters((pre) => ({
                                   ...pre,
                                   maxPrice: Math.min(Number(e.target.value), MAX_PRICE)
                               }))}
                               className="filter-input" required/>

                    </div>

                    <div dir="rtl" className="relative mx-2 mt-5 h-6">
                        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-light-gray"/>

                        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary-blue"
                             style={{right: `${minPercent}%`, width: `${maxPercent - minPercent}%`}}/>

                        <input type="range" min={0} max={MAX_PRICE} value={filters.minPrice} onChange={(e) => {
                            const value = Number(e.target.value);
                            setFilters((prevState) => ({...prevState, minPrice: Math.min(value, prevState.maxPrice)}))
                        }} className="dual-range"/>
                        <input type="range" min={0} max={MAX_PRICE} value={filters.maxPrice} onChange={(e) => {
                            const value = Number(e.target.value);
                            setFilters((prevState) => ({...prevState, maxPrice: (Math.max(value, prevState.minPrice))}))
                        }} className="dual-range"/>
                    </div>

                    <ul className="flex items-center gap-2 text-sm">
                        {SUGGESTED_PRICES.map((p) => (
                            <button type="button" key={p.label} onClick={() => {
                                setFilters((pre) => ({...pre, minPrice: p.min, maxPrice: p.max}))
                            }}
                                    className="border border-light-gray p-2 rounded-full cursor-pointer hover:bg-lightest-gray hover:border-dark-gray transition-colors duration-300">{p.label}</button>
                        ))}
                    </ul>
                </div>

                <div className="py-3  ">
                    <button onClick={handleApplyFilters} type="button"
                            className="bg-primary-blue text-white font-semibold w-full p-2 rounded-lg cursor-pointer">نمایش
                        کالا
                    </button>
                </div>

            </div>
        </BottomSheet>
    );
}

export default FilterBottomSheet;