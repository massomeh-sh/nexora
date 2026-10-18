import type {JSX} from 'react';
import {Link} from "react-router";

interface CategoryItemProps {
    imageSrc: string;
    title: string;
    categorySlug: string;
}

function categoryItem({imageSrc, title, categorySlug}: CategoryItemProps): JSX.Element {
    return (
        <Link to={`/search?category=${categorySlug}`}
              className="flex flex-col grow items-center justify-center gap-2 min-w-[100px]">
            <img src={imageSrc} className="w-28" alt={title}/>
            <p className="text-darkest-gray text-sm max-lg:text-[12px]">{title}</p>
        </Link>
    );
}

export default categoryItem;