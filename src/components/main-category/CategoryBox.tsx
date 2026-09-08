import type {JSX} from 'react';
import CategoryItem from "./categoryItem.tsx";
import {categoryItems} from "../../constants/category-items.ts";

function CategoryBox(): JSX.Element {
    return (
        <div className="mt-10 overflow-hidden">
            <div
                className="flex items-baseline max-lg:gap-8 overflow-x-auto scrollbar-none scroll-smooth">
                {categoryItems.map((item, index) => (
                    <CategoryItem key={index} title={item.title} imageSrc={item.imageSrc} slug={item.slug}/>))}
            </div>
        </div>
    );
}

export default CategoryBox;