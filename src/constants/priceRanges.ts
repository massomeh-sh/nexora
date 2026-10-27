import type {PriceRange} from "../types/priceRange.ts";

export const PRICE_RANGES: PriceRange[] = [
    {id: "under-1", label: "کمتر از 1 میلیون تومان", max: 1_000_000},
    {id: "1-5", label: "۱ تا ۵ میلیون تومان", min: 1_000_000, max: 5_000_000},
    {id: "5-10", label: "۵ تا ۱۰ میلیون تومان", min: 5_000_000, max: 10_000_000},
    {id: "over-10", label: "بیشتر از ۱۰ میلیون تومان", min: 10_000_000},
]