import type {ComponentType, SVGProps} from "react";

export interface NavLink {
    id: string;
    label: string;
    href: string;
    icon: string;
}

interface CategoryChildren {
    id: number;
    title: string;
    slug: string;
}

export interface CategoriesList {
    id: number;
    name: string;
    slug: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    children: CategoryChildren[];
}
