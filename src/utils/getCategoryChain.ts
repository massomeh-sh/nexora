import type {CategoriesData} from "../types/product.ts";

export function getCategoryChain(categories: CategoriesData[], slug: string | null) {
    if (!slug) return [];

    const chain = [];
    let current = categories.find((c) => c.slug === slug);

    while (current) {
        chain.unshift(current);

        const parent = current.parent;
        const parentId = parent && typeof parent === 'object' ? (parent as {
            _id: string
        })._id : (parent as string | null | undefined);
        current = parentId ? categories.find((c) => c._id === parentId) : undefined;
    }

    return chain;
}