import type {Product} from "@/types/product.ts";

export function getCartItemView(product: Product, variantId?: string | null) {
    const id = variantId ?? product.selectedVariantId;
    const variant = id ? product.variants?.find((v) => v._id === id) : undefined;

    return {
        image: variant?.images?.[0] ?? product.images?.[0],
        colorName: variant?.colorName,
        colorHex: variant?.colorHex,
    };
}