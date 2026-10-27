import type {JSX} from 'react';
import type {Product} from "@/types/product.ts";

interface ProductColorsProps {
    // Props here
    product: Product;
    onChangeValue: (id: string) => void;
    selectedVariantId: string | undefined;
}

function ProductColors({product, onChangeValue, selectedVariantId}: ProductColorsProps): JSX.Element {
    return (
        <div className='flex flex-col mt-5 text-lg gap-3'>
            <p>رنگ بندی:</p>
            <ul className="flex items-center gap-4">
                {product.variants.map((v) => (
                    <li key={v._id}>
                        <button onClick={() => onChangeValue(v._id)}
                                className={`cursor-pointer w-22 h-22 bg-light-gray border rounded-lg ${v._id === selectedVariantId ? "border-primary-blue" : "border-light-gray"}`}>
                            <img alt={v._id} src={`${import.meta.env.VITE_API_BASE_URL}${v.images[0]}`}
                                 className="w-full h-full object-cover"/>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductColors;