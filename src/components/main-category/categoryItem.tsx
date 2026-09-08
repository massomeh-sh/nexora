import type {JSX} from 'react';
import {Link} from "react-router";

interface CategoryItemProps {
    imageSrc: string;
    title: string;
    slug: string;
}

function categoryItem({imageSrc, title, slug}: CategoryItemProps): JSX.Element {
    return (
        <Link to={slug} className="flex flex-col grow items-center justify-center gap-2 min-w-[85px]">
            <img src={imageSrc} className="w-28" alt={title}/>
            <p className="text-darkest-gray max-lg:text-[12px]">{title}</p>
        </Link>
    );
}

export default categoryItem;