import type {JSX} from 'react';
import type {Product} from "../../types/product.ts";

interface ProductCard2Props {
    // Props here
    product: Product;
}

function RecentlyViewedProductCard({product}: ProductCard2Props): JSX.Element {
    return (
        <div>
            ProductCard2
        </div>
    );
}

export default RecentlyViewedProductCard;