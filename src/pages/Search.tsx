import {type JSX} from 'react';
import {useGetAllProducts} from "../hooks/useGetAllProducts.ts";
import {toast} from "sonner";

function SearchPage(): JSX.Element {
    const {data, isLoading, isError, error} = useGetAllProducts();

    if (isError) {
        toast.error(error.message);
    }

    console.log(data);
    return (
        <div>
            Search
        </div>
    );
}

export default SearchPage;