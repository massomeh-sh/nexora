import {type JSX, useState} from 'react';
import {useSearchParams} from "react-router";
import PlusMinus from "../../UI/PlusMinus.tsx";
import {PRICE_RANGES} from "@/constants/priceRanges.ts";
import type {PriceRange} from "@/types/priceRange.ts";
import StarRating from "../../UI/ProductRating.tsx";
import CheckBox from "../../UI/CheckBox.tsx";

function ProductsFilter(): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilterDropdown, setShowFilterDropdown] = useState({
        price: true,
        rating: true
    });

    const category = searchParams.get('category');
    const rating = searchParams.get('rating');

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');


    const activePrice = PRICE_RANGES.find((p) => (p.min?.toString() ?? "") === (minPrice ?? "") &&
        (p.max?.toString() ?? "") === (maxPrice ?? ""))

    const hasFilters = rating || minPrice || maxPrice;

    const removePrice = () => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('minPrice');
        newSearchParams.delete('maxPrice');
        newSearchParams.delete('page');
        setSearchParams(newSearchParams);
    };

    const removeFilter = (filterName: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(filterName);
        newSearchParams.delete("page")
        setSearchParams(newSearchParams);
    }

    const handleDeleteAllFilters = () => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("minPrice");
        newSearchParams.delete("maxPrice");
        newSearchParams.delete("page");
        newSearchParams.delete("rating");

        setSearchParams(newSearchParams);
    }

    const handlePriceChange = (range: PriceRange) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('minPrice');
        newSearchParams.delete('maxPrice');
        if (range.min !== undefined) newSearchParams.set('minPrice', String(range.min));
        if (range.max !== undefined) newSearchParams.set('maxPrice', String(range.max));
        newSearchParams.delete('page');
        setSearchParams(newSearchParams);
    }


    const handleRatingChange = (rating: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("rating", rating);
        newSearchParams.delete('page');

        setSearchParams(newSearchParams);
    }


    return (
        <div className="flex flex-col gap-5 *:bg-white *:p-6 *:rounded-lg max-2xl:hidden sticky top-35 self-start">
            {(hasFilters || category) && <div>
                <div className="flex items-center justify-between border-b border-light-gray pb-2">
                    <h2 className="text-lg">فیلتر ها</h2>
                    {hasFilters &&
                        <button onClick={handleDeleteAllFilters}
                                className="text-primary-red underline underline-offset-2 cursor-pointer">حذف
                            همه</button>}
                </div>

                <div className="mt-3 flex gap-2 flex-wrap *:bg-lightest-gray *:p-2 *:rounded-lg text-sm">
                    {category && <button>{category}</button>
                    }
                    {activePrice && <button onClick={removePrice}
                                            className="flex items-center gap-2 text-dark-gray cursor-pointer">
                        <span>{activePrice.label}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                             fill="none">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z"
                                  fill="#080341"/>
                        </svg>
                    </button>}
                    {rating && <button onClick={() => removeFilter('rating')}
                                       className="flex items-center gap-3 text-dark-gray cursor-pointer">
                        <span>امتیاز {rating}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                             fill="none">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z"
                                  fill="#080341"/>
                        </svg>
                    </button>}
                </div>
            </div>}

            <div className="flex flex-col gap-3">
                <div className="text-lg flex items-center justify-between">
                    <h2>قیمت</h2>
                    <button onClick={() => setShowFilterDropdown((pre) => {
                        return {...pre, price: !pre.price}
                    })}
                            className="bg-lightest-gray rounded-full px-2 py-1 cursor-pointer">
                        <PlusMinus open={showFilterDropdown.price}/>
                    </button>
                </div>
                {
                    showFilterDropdown.price && (
                        <div className="border-t border-light-gray w-full pt-3 overflow-y-auto">
                            <div className="flex flex-col gap-4">
                                {PRICE_RANGES.map((range) => (
                                    <label key={range.id} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price"
                                            className="sr-only peer"
                                            checked={activePrice?.id === range.id}
                                            onChange={() => handlePriceChange(range)}
                                        />
                                        <CheckBox/>
                                        {range.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )
                }
            </div>

            <div className="flex flex-col gap-3">
                <div className="text-lg flex items-center justify-between">
                    <h2>امتیاز کاربران</h2>
                    <button onClick={() => setShowFilterDropdown((pre) => {
                        return {...pre, rating: !pre.rating}
                    })}
                            className="bg-lightest-gray rounded-full px-2 py-1 cursor-pointer">
                        <PlusMinus open={showFilterDropdown.rating}/>
                    </button>
                </div>
                {showFilterDropdown.rating && (
                    <div className="border-t border-light-gray w-full pt-3 overflow-y-auto">
                        <div className="flex flex-col-reverse gap-4">
                            {Array.from({length: 5}).map((_, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <label
                                        className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="rating"
                                            className="sr-only peer"
                                            value={String(index + 1)}
                                            checked={rating === String(index + 1)}
                                            onChange={() => handleRatingChange(String(index + 1))}
                                        />
                                        <CheckBox/>
                                        <StarRating productRating={index + 1}/>
                                    </label>
                                    <span className="bg-lightest-gray text-dark-gray px-1"> {index + 1} امتیاز</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>


        </div>
    )
        ;
}

export default ProductsFilter;