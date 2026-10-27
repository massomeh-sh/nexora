import {type JSX, useId} from 'react';
import {SORT_OPTIONS} from "@/constants/sortOptions.ts";

interface ProductSortSelectorProps {
    // Props here
    value: string;
    setParam: (paramsName: string, value: string) => void;
}

function ProductSortSelector({value, setParam}: ProductSortSelectorProps): JSX.Element {
    const selectorId = useId();

    return (
        <div className="relative w-64 flex items-center gap-3">
            <label htmlFor={selectorId} className="whitespace-nowrap text-dark-gray">مرتب سازی:</label>
            <select id={selectorId} value={value} onChange={(e) => setParam("sort", e.target.value)}
                    className="w-full appearance-none bg-lightest-gray text-sm rounded-lg cursor-pointer outline-none ps-3 py-2.5 border border-light-gray focus:ring-2 focus:ring-primary-blue">
                {SORT_OPTIONS.map((o) => (
                    <option value={o.value} key={o.value}>{o.label}</option>
                ))}
            </select>
            <svg className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
                 width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
}

export default ProductSortSelector;