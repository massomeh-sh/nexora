import {type JSX} from 'react';
import {SORT_OPTIONS_QUANTITY} from "@/constants/sortOptions.ts";
import {useUpdateParam} from "@/hooks/useUpdateParam.ts";
import FilterButton from "@/UI/FilterButton.tsx";
import ProductSortSelector from "@/UI/ProductSortSelector.tsx";


interface SortProductsProps {
    numProducts: number | undefined;
}

function SortProducts({numProducts}: SortProductsProps): JSX.Element {
    const {searchParams, setParam} = useUpdateParam();
    const sort = searchParams.get("sort") ?? "";
    const limit = searchParams.get("limit") ?? "";


    return (
        <div className="flex items-center justify-between bg-white p-5 rounded-lg w-full hidden md:block">
            <div className="flex items-center gap-3">
                <ProductSortSelector value={sort} setParam={setParam}/>
                <div className="relative w-46 flex items-center gap-3">
                    <select id="limit" value={limit} onChange={(e) => setParam("limit", e.target.value)}
                            className="w-full appearance-none bg-lightest-gray text-sm rounded-lg cursor-pointer outline-none ps-3 py-2.5 border border-light-gray focus:ring-2 focus:ring-primary-blue">
                        {SORT_OPTIONS_QUANTITY.map((o) => (
                            <option value={o.value} key={o.value}>{o.label}</option>
                        ))}
                    </select>
                    <svg className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
                         width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                <FilterButton/>

                {numProducts > 0 && <p className="text-gray-400 flex items-center justify-center gap-1 mr-auto">
                    <span>{numProducts}</span><span>کالا</span>
                </p>}
            </div>

        </div>
    );
}

export default SortProducts;