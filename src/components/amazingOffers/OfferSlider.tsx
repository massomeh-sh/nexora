import {type JSX, useCallback, useEffect, useRef, useState} from 'react';
import ProductCard from "@/components/product/ProductCard.tsx";
import type {Product} from "../../types/product.ts";
import {Link} from "react-router";
import * as React from "react";

interface OfferSliderProps {
    dealProducts: Product[];
}

function OfferSlider({dealProducts}: OfferSliderProps): JSX.Element {
    const offerSliderRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const hasMoved = useRef(false);
    const startX = useRef(0);
    const scrollLeftStart = useRef(0);

    const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
    const [showRightArrow, setShowRightArrow] = useState<boolean>(false);


    const updateArrow = useCallback(() => {
        const el = offerSliderRef.current;
        if (!el) return;

        const {scrollLeft, scrollWidth, clientWidth} = el;
        const isRtl = getComputedStyle(el).direction === "rtl";

        const maxScroll = isRtl ? 0 : scrollWidth - clientWidth;
        const minScroll = isRtl ? -(scrollWidth - clientWidth) : 0;

        const atLeftMost = scrollLeft <= minScroll + 1;
        const atRightMost = scrollLeft >= maxScroll - 1;

        setShowLeftArrow(!atLeftMost);
        setShowRightArrow(!atRightMost);
    }, [])

    useEffect(() => {
        updateArrow();
    }, [dealProducts, updateArrow]);

    const scrollRight = (): void => {
        offerSliderRef.current?.scrollBy({
            left: 150,
        })
    }

    const scrollLeft = (): void => {
        offerSliderRef.current?.scrollBy({
            left: -150,
        })
    }

    const handlePointerDown = (e: React.PointerEvent): void => {
        const el = offerSliderRef.current;
        if (!el) return;

        isDragging.current = true;
        hasMoved.current = false;
        startX.current = e.clientX;
        scrollLeftStart.current = el.scrollLeft;
    }

    const handlePointerMove = (e: React.PointerEvent): void => {
        if (!isDragging.current) return;
        const el = offerSliderRef.current;
        if (!el) return;

        const move = e.clientX - startX.current;

        if (!hasMoved.current && Math.abs(move) > 5) {
            hasMoved.current = true;
            el.setPointerCapture(e.pointerId);
        }

        if (hasMoved.current) {
            el.scrollLeft = scrollLeftStart.current - move;
        }
    }

    const handlePointerUp = (e: React.PointerEvent): void => {
        isDragging.current = false;
        const el = offerSliderRef.current;
        if (hasMoved.current && el?.hasPointerCapture(e.pointerId)) {
            el.releasePointerCapture(e.pointerId);
        }
    }

    const handlePointerCancel = (): void => {
        isDragging.current = false;
        hasMoved.current = false;
    }

    const handleClickCapture = (e: React.MouseEvent): void => {
        if (hasMoved.current) {
            e.preventDefault();
            e.stopPropagation();
        }
    }


    return (
        <div className="relative overflow-hidden">
            {showLeftArrow && (
                <button onClick={scrollLeft}
                        className="cursor-pointer bg-white border absolute left-2 top-1/2 -translate-y-1/2 z-10 text-gray-500 border border-gray-500 rounded-full p-1 max-lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                         fill="none">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L9.41421 12L15.7071 18.2929C16.0976 18.6834 16.0976 19.3166 15.7071 19.7071C15.3166 20.0976 14.6834 20.0976 14.2929 19.7071L7.29289 12.7071C7.10536 12.5196 7 12.2652 7 12C7 11.7348 7.10536 11.4804 7.29289 11.2929L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289Z"
                              fill="currentColor"/>
                    </svg>
                </button>
            )}
            <div ref={offerSliderRef} onScroll={updateArrow}
                 onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
                 onPointerCancel={handlePointerCancel} onClickCapture={handleClickCapture}
                 className="flex gap-2 overflow-x-auto scrollbar-none scroll-smooth select-none">
                {dealProducts.map((product: Product) => (
                    <ProductCard key={product._id} product={product}/>
                ))}
                <div
                    className="bg-white min-w-[220px] max-lg:min-w-[150px] bg-lightest-gray p-4 max-lg:p-2 flex justify-center items-center ml-3">
                    <Link to="/incredible-offers" className="flex items-center justify-center flex-col gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             className="max-lg:border max-lg:rounded-full"
                             fill="none">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z"
                                  fill="#000000"/>
                        </svg>
                        <p className="max-lg:text-sm">مشاهده همه</p>
                    </Link>
                </div>
            </div>
            {showRightArrow && (
                <button onClick={scrollRight}
                        className="cursor-pointer bg-white border absolute right-2 top-1/2 -translate-y-1/2 z-10 text-gray-500 border border-gray-500 rounded-full p-1 max-lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M8.29289 4.29289C8.68342 3.90237 9.31658 3.90237 9.70711 4.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L9.70711 19.7071C9.31658 20.0976 8.68342 20.0976 8.29289 19.7071C7.90237 19.3166 7.90237 18.6834 8.29289 18.2929L14.5858 12L8.29289 5.70711C7.90237 5.31658 7.90237 4.68342 8.29289 4.29289Z"
                              fill="currentColor"/>
                    </svg>
                </button>
            )}
        </div>
    );
}

export default OfferSlider;