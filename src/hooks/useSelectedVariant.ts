import type {Product} from "@/types/product.ts";
import {useMemo, useState} from "react";

export function useSelectedVariant(product?: Product) {
    const variants = product?.variants ?? [];

    const [chosenId, setVariantId] = useState<string | undefined>();

    const variant =
        variants.find(v => v._id === chosenId) ??
        variants.find(v => v.stock > 0) ??
        variants[0];

    const displayProduct = useMemo((): Product | undefined => {
        if (!product || !variant) return product;

        return {
            ...product,
            images: variant.images.length ? variant.images : product.images,
            stock: variant.stock,
            inStock: variant.stock > 0,
            selectedVariantId: variant._id,
        };
    }, [product, variant]);

    return {variant, setVariantId, variantId: variant?._id, displayProduct};
}