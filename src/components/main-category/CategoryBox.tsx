import type {JSX} from 'react';
import CategoryItem from "./CategoryItem.tsx";
import {categoryItems} from "../../constants/category-items.ts";

function CategoryBox(): JSX.Element {
    return (
        <div className="mt-10 overflow-hidden">
            <div
                className="flex items-baseline gap-20 max-lg:gap-8 overflow-x-auto scrollbar-none scroll-smooth">
                {categoryItems.map((item, index) => (
                    <CategoryItem key={index} title={item.title} imageSrc={item.imageSrc} categorySlug={item.categorySlug}/>))}
            </div>
        </div>
    );
}

export default CategoryBox;