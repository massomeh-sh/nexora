import {type JSX, useCallback, useEffect, useRef, useState} from 'react';
import {productSlider} from "../../constants/productSlider.ts";
import * as React from "react";

const IMAGES = [productSlider[productSlider.length - 1], ...productSlider, productSlider[0]];

function ProductImageSlider(): JSX.Element {
    const [currentImage, setCurrentImage] = useState(productSlider.length);
    const [hasTransition, setHasTransition] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 1023px)").matches);

    const queueRef = useRef<("next" | "prev")[]>([]);
    const isAnimatingRef = useRef(false);
    const timerRef = useRef<number | undefined>(undefined);
    const startX = useRef(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 1023px)");
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    const SLIDE_PERCENT = isMobile ? 86 : 100;
    const PEEK = (100 - SLIDE_PERCENT) / 2;

    const translateX = -(currentImage * SLIDE_PERCENT) + PEEK + dragOffset;

    const stopTimer = useCallback(() => {
        clearInterval(timerRef.current);
    }, []);

    const startTimer = useCallback(() => {
        stopTimer();
        timerRef.current = setInterval(() => setCurrentImage((pre) => pre - 1), 5000);
    }, [stopTimer]);

    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, [startTimer, stopTimer]);

    const runNextQueueItem = () => {
        if (isAnimatingRef.current) return;

        const nextAction = queueRef.current.shift();

        if (!nextAction) return;

        isAnimatingRef.current = true;

        if (nextAction === "next") {
            setCurrentImage((pre) => pre + 1);
        } else {
            setCurrentImage((pre) => pre - 1);
        }
    }

    const nextImage = () => {
        stopTimer();
        queueRef.current.push("next");
        runNextQueueItem();
        startTimer();
    };

    const prevImage = () => {
        stopTimer();
        queueRef.current.push("prev");
        runNextQueueItem();
        startTimer();
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(true);
        stopTimer();
        startX.current = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
        setHasTransition(false);
    }


    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || !sliderRef.current) return;
        const currentX = event.clientX;
        const move = currentX - startX.current;
        const percent = Math.trunc((move / sliderRef.current.clientWidth) * 100);
        setDragOffset(percent);
    }

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        if (dragOffset > 30) {
            prevImage();
        } else if (dragOffset < -30) {
            nextImage();
        }
        setDragOffset(0);
        startTimer();
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        setHasTransition(true);
    }

    const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        setDragOffset(0);
        startTimer();
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        setHasTransition(true);
    }

    const handleTransitionEnd = () => {
        isAnimatingRef.current = false;

        if (currentImage === IMAGES.length - 1) {
            // first copy
            setHasTransition(false);
            setCurrentImage(1);


            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setHasTransition(true);

                    runNextQueueItem();
                });
            });

            return;
        }

        if (currentImage === 0) {
            // last copy
            setHasTransition(false);
            setCurrentImage(IMAGES.length - 2);


            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setHasTransition(true);

                    runNextQueueItem();
                });
            });

            return;
        }
        runNextQueueItem();
    }


    const getDotPosition = () => {
        if (currentImage === 0) {
            return productSlider.length - 1;
        }

        if (currentImage === IMAGES.length - 1) {
            return 0;
        }

        return currentImage - 1;
    }

    const dotPos: number = getDotPosition();

    return (
        <section ref={sliderRef} aria-label="Nexora Product Slider" role="region" dir="ltr"
                 className="relative h-full w-full overflow-hidden aspect-[16/4] max-md:aspect-[16/8] max-sm:aspect-[16/5] group max-lg:mt-5">
            <div onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
                 onPointerUp={handlePointerUp} onPointerCancel={handlePointerCancel}
                 onTransitionEnd={handleTransitionEnd}
                 className={`flex h-full w-full cursor-pointer ${hasTransition ? "transition-transform duration-500" : ""} touch-pan-y select-none`}
                 style={{transform: `translateX(${translateX}%)`}}>
                {IMAGES.map((image, index) => (
                    <div aria-hidden={index !== currentImage} key={index} style={{minWidth: `${SLIDE_PERCENT}%`}}>
                        <img src={image.imageUrl} alt={image.alt}
                             className="block object-cover w-full h-full pointer-events-none rounded-lg max-lg:p-1.5 max-lg:rounded-2xl"/>
                    </div>
                ))}
            </div>
            <div
                className="flex absolute bottom-7 right-4 opacity-0 group-hover:opacity-100 group-has-[button:focus-visible]:opacity-100 : text-darkest-gray transition-opacity duration-200 max-lg:hidden">
                <button type="button" aria-label="محصول قبل" onClick={prevImage}
                        className="bg-white p-3 rounded-full active:scale-90 cursor-pointer hover:bg-lightest-gray">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24"
                         viewBox="0 0 24 24">
                        <path
                            d="M1.293,12.707a1,1,0,0,1,0-1.414l5-5A1,1,0,0,1,7.707,7.707L4.414,11H22a1,1,0,0,1,0,2H4.414l3.293,3.293a1,1,0,1,1-1.414,1.414Z"/>
                    </svg>
                </button>
                <button type="button" aria-label="محصول بعد" onClick={nextImage}
                        className="bg-white p-3 rounded-full active:scale-90 cursor-pointer hover:bg-lightest-gray">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24"
                         viewBox="0 0 24 24">
                        <path
                            d="M17.707,17.707a1,1,0,0,1-1.414-1.414L19.586,13H2a1,1,0,0,1,0-2H19.586L16.293,7.707a1,1,0,0,1,1.414-1.414l5,5a1,1,0,0,1,0,1.414Z"/>
                    </svg>
                </button>
            </div>
            <div
                className="flex gap-3 absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-300 max-lg:hidden">
                {productSlider.map((_, i) => <button type="button" aria-label={`عکس${i + 1}`}
                                                     aria-current={i === dotPos ? "true" : undefined} key={i}
                                                     onClick={() => {
                                                         stopTimer();
                                                         setCurrentImage(i + 1);
                                                         startTimer();
                                                     }}
                                                     className={`rounded-full ${i === dotPos ? "w-5 h-2 bg-black" : "bg-black/40 w-2 h-2"}`}></button>
                )}
            </div>
            <div aria-live="polite" className="sr-only">
                محصول {dotPos + 1} از {productSlider.length}
            </div>
        </section>
    )
}

export default ProductImageSlider;

