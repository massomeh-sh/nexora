import {useSearchParams} from "react-router";

export function useUpdateParam() {
    const [searchParams, setSearchParams] = useSearchParams();

    const setParam = (key: string, value: string) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value);
        else next.delete(key);
        next.delete("page");
        setSearchParams(next);
    };

    return {searchParams, setParam};
}