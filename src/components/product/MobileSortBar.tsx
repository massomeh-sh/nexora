import type {JSX} from "react";
import {useUpdateParam} from "@/hooks/useUpdateParam.ts";
import FilterButton from "@/UI/FilterButton.tsx";
import ProductSortSelector from "@/UI/ProductSortSelector.tsx";

interface Props {
    numProducts: number | undefined;
}

function MobileSortBar({numProducts}: Props): JSX.Element {
    const {searchParams, setParam} = useUpdateParam();
    const sort = searchParams.get("sort") ?? "";

    return (
        <>
            <div
                className="flex items-center gap-2 border-y bg-white border-lightest-gray px-5 py-3 w-full md:hidden self-start z-[102]">
                <FilterButton/>
                <ProductSortSelector value={sort} setParam={setParam}/>
                <span className="ms-auto shrink-0 text-sm text-gray-400">{numProducts} کالا</span>
            </div>
        </>
    );
}

export default MobileSortBar;