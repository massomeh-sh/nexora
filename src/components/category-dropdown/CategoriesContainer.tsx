import type {JSX} from 'react';
import CategoriesList from "./CategoriesList.tsx";

function CategoriesContainer(): JSX.Element {
    return (
        <nav aria-label="دسته‌بندی محصولات"
             className="absolute top-full right-6 bg-white h-96 shadow-lg border-t border-light-gray">
            <CategoriesList/>
        </nav>
    )
}

export default CategoriesContainer;