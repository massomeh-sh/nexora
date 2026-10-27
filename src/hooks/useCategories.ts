import {useQuery} from "@tanstack/react-query";
import {getCategories} from "../api/category.ts";

export function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        staleTime: Infinity,
    })
}