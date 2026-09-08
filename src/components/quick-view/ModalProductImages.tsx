import {type JSX, useState} from 'react';
import type {Product} from "../../types/product.ts";

interface ModalProductImagesProps {
    // Props here
    product: Product;
}

function ModalProductImages({product}: ModalProductImagesProps): JSX.Element {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const nextImg = () => {
        setCurrentImageIndex((cur) => cur + 1)
    }

    const prevImg = () => {
        setCurrentImageIndex((cur) => cur - 1)
    }

    return (
        <div className="w-1/2 max-md:w-full h-[600px] bg-light-gray max-md:h-[350px] flex flex-col p-3 gap-4">
            <div className="w-full overflow-hidden relative bg-white select-none">
                <div dir="ltr" className="flex h-full transition-transform duration-300"
                     style={{transform: `translateX(${currentImageIndex * 100}%)`}}>
                    {product.images.map((img: string, index: number) => (<img key={index}
                                                                              src={`${import.meta.env.VITE_API_BASE_URL}${img}`}
                                                                              className="w-full h-full object-contain shrink-0"
                                                                              alt={product.name}/>))}
                </div>
                <button aria-label="عکس بعدی" onClick={nextImg} disabled={currentImageIndex === 0}
                        className={`absolute top-1/2 -translate-y-1/2 left-1 p-1.5 rounded-full ${currentImageIndex === 0 ? "bg-lightest-gray text-light-gray cursor-default" : "bg-lightest-gray text-dark-gray cursor-pointer"}`}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
                         height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
                    </svg>
                </button>
                <button aria-label="عکس قبلی" onClick={prevImg}
                        disabled={currentImageIndex === -(product.images.length - 1)}
                        className={`absolute top-1/2 -translate-y-1/2 right-1 p-1.5 text-dark-gray rounded-full ${currentImageIndex === -(product?.images.length - 1) ? "bg-lightest-gray text-light-gray cursor-default" : "bg-lightest-gray text-dark-gray cursor-pointer"}`}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
                         height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
                    </svg>
                </button>
            </div>
            <div dir="ltr" className="w-full grid grid-cols-3 gap-3 items-center justify-center select-none">
                {product.images.map((_, index: number) => (
                    <img key={index} draggable={false}
                         src={`${import.meta.env.VITE_API_BASE_URL}${product.images[index]}`}
                         onClick={() => setCurrentImageIndex(-index)}
                         alt={product.name}/>))}
            </div>
        </div>
    );
}

export default ModalProductImages;