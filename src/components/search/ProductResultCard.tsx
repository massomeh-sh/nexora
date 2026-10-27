import type {JSX} from 'react';
import type {Product} from "@/types/product.ts";
import {FaStar} from "react-icons/fa";
import {priceFormater} from "@/utils/priceFormater.ts";
import DiscountPrice from "../../UI/DiscountPrice.tsx";
import {Link} from "react-router";

interface ProductResultProps {
    // Props here
    product: Product;
}

function ProductResultCard({product}: ProductResultProps): JSX.Element {
    return (
        <>
            <div
                className="md:hidden relative flex gap-5 py-5 not-last:border-b not-last:border-light-gray">
                <div className="flex flex-col self-center mt-10 gap-5">

                    <h2 className="line-clamp-2 text-sm">{product.name}</h2>
                    <div className="text-sm flex items-center gap-2 self-end text-dark-gray">
                        <p>{product.rating}</p>
                        <FaStar className="text-yellow-400"/>
                    </div>
                    <div className="flex items-center justify-between self-end w-full">
                        {product.discountPercent > 0 && <span
                            className="bg-primary-red py-0.5 px-2 text-sm text-white rounded-full">{product.discountPercent}%</span>}
                        {product.stock < 10 && (<p></p>)}
                        <p className="mr-auto space-x-1">
                            <span>{priceFormater(product.discountPrice > 0 ? product.discountPrice : product.price)}</span>
                            <span className="text-xs text-dark-gray">تومان</span>
                        </p>
                    </div>
                    {product.discountPrice > 0 && (
                        <div className="text-sm self-end ml-7.5"><DiscountPrice discount={product.price}/></div>)}
                </div>

            </div>

            <div
                className="relative flex flex-col gap-5 max-md:hidden border border-lightest-gray h-[490px] py-4 hover:shadow-[0_0_12px_rgba(0,0,0,0.20)]">
                <Link to={`/product/${product.name}?product_id=${product._id}`} className="absolute inset-0"/>
                <p className={`px-2 text-primary-red font-bold ${product.discountPercent > 0 ? "opacity-100" : "opacity-0"}`}>فروش
                    ویژه</p>
                <div className="w-full h-60 px-5 pb-5">
                    <img src={`${import.meta.env.VITE_API_BASE_URL}${product.images[0]}`} alt={product.name}
                         className="object-cover w-full h-full"/>
                </div>


                <div className="flex flex-col gap-2 p-3">
                    <h2 className="line-clamp-2 text-dark-gray text-sm">{product.name}</h2>
                    <div className="flex items-center justify-between">
                        {product.stock < 10 && (
                            <p className="text-primary-red text-[13px]">تنها {product.stock} در انبار باقی مانده</p>)}
                        <div className="flex gap-2 items-center text-sm mr-auto">
                            <p className="text-darkest-gray">{String(product.rating).length > 1 ? product.rating.toFixed(1) : product.rating}</p>
                            <FaStar className="text-yellow-400"/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        {product.discountPercent > 0 && <span
                            className="text-white bg-primary-red rounded-full py-0.5 px-2 text-sm">% {product.discountPercent}</span>
                        }
                        <p className="mr-auto">{priceFormater(product.discountPrice > 0 ? product.discountPrice : product.price)}
                            <span className="text-sm">تومان</span></p>
                    </div>
                    {product.discountPrice > 0 && (
                        <div className="mr-auto"><DiscountPrice discount={product.price}/></div>)}
                </div>
            </div>
        </>
    )
        ;
}

export default ProductResultCard;