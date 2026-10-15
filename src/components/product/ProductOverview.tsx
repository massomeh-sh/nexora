import {type JSX, useState} from 'react';
import type {Product, ProductInfo} from "../../types/product.ts";
import {FaChevronLeft, FaStar} from "react-icons/fa";
import saderatBank from "../../assets/img/لوگو-بانک-صادرات-600x600.webp";
import meliank from "../../assets/img/bmi-ir-600x600.webp";
import shaparat from "../../assets/img/لوگوشاپرک.webp";
import melatBank from "../../assets/img/لوگو-بانک-ملت-600x600.webp";
import {dateFormater} from "../../util/dateFormater.ts";
import deliveryTruck from "../../assets/icons/delivery-truck-shipping-transport-svgrepo-com.svg";
import MiniTimeLine from "../MiniDots.tsx";
import ProductFeatures from "./ProductFeatures.tsx";


const randInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

interface ProductDetailsProps {
    // Props here
    product: Product;
}

function ProductOverview({product}: ProductDetailsProps): JSX.Element {
    const [randomNumView] = useState<number>(() => randInt(50, 20));
    const [randomNumOrder] = useState<number>(randInt(20, 1));


    const productDetails: ProductInfo[] = [
        {name: "شناسه محصول", value: `(${product._id})`},
        {name: "وضعیت موجودی", value: product.inStock ? " موجود ✓" : "  ناموجود ✕"},
        {name: "برند", value: product.brand},
        {name: "دسته بندی", value: `${product.category.name}`},
        {name: "واحد", value: product.unit},
        {name: "تاریخ ثبت", value: dateFormater(product.createdAt)}
    ]


    const paymentsLogo = [
        saderatBank, meliank, shaparat, melatBank
    ]


    return (
        <div className="bg-white rounded-lg w-full px-6 py-7 grid grid-cols-2 max-2xl:grid-cols-1">

            <div className="flex flex-col gap-5 pb-5 2xl:border-l 2xl:border-dashed 2xl:border-light-gray 2xl:pl-6">
                {product.images.map((image, index) => (
                    <img key={index} alt={image}
                         className="bg-light-gray rounded-lg border border-light-gray object-cover"
                         src={`${import.meta.env.VITE_API_BASE_URL}${image}`}/>
                ))}
            </div>

            <div className="flex flex-col 2xl:pr-6">
                <div className="flex gap-8 items-center max-md:text-sm">
                    {product.rating > 0 && <div className="flex items-center gap-2">
                        <svg stroke="#2777FC" fill="#2777FC" strokeWidth="0" viewBox="0 0 24 24" height="1em"
                             width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13 9H21L11 24V15H4L13 0V9ZM11 11V7.22063L7.53238 13H13V17.3944L17.263 11H11Z"></path>
                        </svg>
                        <p className="space-x-2">
                            <span>{randomNumOrder}</span>
                            <span>مشتری سفارش داده اند</span>
                        </p>
                    </div>}
                    <div className="flex items-center gap-2">
                        <svg stroke="#2777FC" fill="#2777FC" strokeWidth="0" viewBox="0 0 24 24" height="1em"
                             width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
                        </svg>
                        <p className="space-x-2">
                            <span>{randomNumView}</span>
                            <span>بازدید فعال از محصول</span>
                        </p>
                    </div>


                </div>

                <h1 className="text-2xl font-semibold mt-8">{product.name}</h1>

                <ul className="flex items-center gap-4 text-dark-gray mt-2">
                    {product.rating > 0 && <li className="flex items-center gap-2">
                        <FaStar className="text-amber-400"/>
                        <span>{Math.ceil(product.rating)} امتیاز </span>
                    </li>}
                    {product.reviews.length > 0 && <li>
                        <p className="flex items-center gap-2">
                            <span className="text-2xl">&bull;</span>
                            <span>{product.numReviews} دیدگاه </span>
                        </p>
                    </li>}
                    <li>
                        <p className="flex items-center gap-2">
                            <span className="text-2xl">&bull;</span>
                            <span>1 عدد فروخته شده</span>
                        </p>
                    </li>
                </ul>

                <p className="text-dark-gray">{product.shortDescription}</p>

                <h2 className='text-lg mt-5 border-t pt-5 border-dark-gray'>درباره محصول:</h2>

                <ul className="grid grid-cols-2 border-b border-dark-gray pb-5 gap-y-3 mt-5">
                    {productDetails.map((d) => (<li key={d.name}
                                                    className={`flex items-center gap-2  ${d.name === "شناسه محصول" ? "col-span-2" : ""}`}>
                        <span className="shrink-0">{d.name}:</span>
                        <span
                            className={`text-sm text-dark-gray min-w-0`}>{d.value}</span>
                    </li>))}
                </ul>

                <div className="flex gap-3 mt-5 border border-light-gray p-4 rounded-lg">
                    <MiniTimeLine count={4}/>
                    <div className="flex flex-col">
                        <h2 className="text-primary-purple">ارسال رایگان سفارش ها برای اعضای پلاس</h2>
                        <ul className="mt-2 space-y-3 text-dark-gray">
                            <li>4 ارسال رایگان نکسورا</li>
                            <li>2 ارسال هایپر مارکت</li>
                            <li>4 ارسال رایگان سوپرمارکت</li>
                            <li>پشتیبانی اختصاصی</li>
                        </ul>
                        <button
                            className="ml-auto flex gap-1 items-center mt-3 text-primary-blue cursor-pointer no-underline hover:underline active:underline underline-offset-4">
                            <span> خرید اشتراک</span>
                            <FaChevronLeft className="w-2"/>
                        </button>
                    </div>
                    <img src={deliveryTruck} alt="ایکون ماشین" className="w-10 h-10 -mb-1 self-end mr-auto"/>
                </div>

                <div className="mt-5 py-5 border-t border-dark-gray">
                    <h2>پرداخت امن و تضمین شده</h2>
                    <ul className="flex gap-2 justify-between items-center mt-5">
                        {paymentsLogo.map((b) => (
                            <li className="w-24 h-24" key={b}><img src={b} alt={b}
                                                                   className="object-cover w-full h-full"/>
                            </li>))}
                    </ul>
                </div>

                <ProductFeatures/>

            </div>
        </div>
    );
}

export default ProductOverview;