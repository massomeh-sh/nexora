import type {ComponentType, SVGProps} from "react";

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
}

interface CategoryChildren {
    id: number;
    title: string;
    slug: string;
}

export interface CategoriesList {
    id: number;
    name: string;
    title: string;
    slug: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    children: CategoryChildren[];
}
