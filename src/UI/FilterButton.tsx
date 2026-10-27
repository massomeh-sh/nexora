import type {JSX} from 'react';
import {FiSliders} from "react-icons/fi";
import {useSheetRoute} from "@/hooks/useSheetRoute.ts";

function FilterButton(): JSX.Element {
    const filterSheet = useSheetRoute("filterProducts");

    return (
        <button
            aria-label="منوی فیلتر"
            onClick={() => filterSheet.open()}
            className="shrink-0 flex items-center gap-1.5 rounded-full bg-primary-blue text-white  px-3 py-1.5 cursor-pointer 2xl:hidden"
        >
            <FiSliders/>
            <span>فیلتر</span>
        </button>
    );
}

export default FilterButton;