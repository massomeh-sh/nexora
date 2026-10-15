import {type JSX, type PointerEvent, useEffect, useRef, useState} from 'react';
import {reviewSortOptions} from "../../constants/ReviewSortOptions.ts";
import type {ReviewSortType} from "../../types/product.ts";

interface ProductSortDropdownProps {
    // Props here
    close: () => void;
    currentSort: string;
    changeSort: (newSort: ReviewSortType) => void;
    isOpen: boolean;
}

const COLLAPSED = 0.4;


function ReviewSortDropdown({close, currentSort, changeSort, isOpen}: ProductSortDropdownProps): JSX.Element {
    const [expanded, setExpanded] = useState(false);
    const [dragHeight, setDragHeight] = useState<number | null>(null);
    const startY = useRef(0);
    const startHeight = useRef(0);
    const lastHeight = useRef(0);
    const sheetRef = useRef<HTMLDivElement>(null);
    const isPressed = useRef(false);
    const isDragRef = useRef(false);


    // هر بار پنل بسته شد همه چیز ریست بشه تا پنل بار بعد از 30 درصد باز شود
    useEffect(() => {
        if (!isOpen) {
            setExpanded(false);
            setDragHeight(null);
        }
    }, [isOpen]);


    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        startY.current = e.clientY;
        startHeight.current = sheetRef.current?.offsetHeight ?? 0;
        lastHeight.current = startHeight.current;
        isPressed.current = true;
        isDragRef.current = false;
    }

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (!isPressed.current) return;
        const delta = startY.current - e.clientY;


        if (e.pointerType === "mouse" && e.buttons === 0) {
            isPressed.current = false;
            isDragRef.current = false;
            setDragHeight(null);
            return;
        }

        if (!isDragRef.current) {
            if (Math.abs(delta) < 5) return;
            isDragRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
        }

        const max = window.innerHeight;
        const next = Math.min(max, Math.max(0, startHeight.current + delta));
        lastHeight.current = next;
        setDragHeight(next);
    }

    const onPointerUp = () => {
        const wasDragging = isDragRef.current;
        isPressed.current = false;
        isDragRef.current = false;
        if (!wasDragging) return;

        const ratio = lastHeight.current / window.innerHeight;
        setDragHeight(null);

        if (ratio < COLLAPSED * 0.7) {
            close();
        } else if (ratio > (COLLAPSED + 1) / 2) {
            setExpanded(true);
        } else {
            setExpanded(false);
        }
    }


    const onPointerCancel = () => {
        isPressed.current = false;
        isDragRef.current = false;
        setDragHeight(null);
    }

    const isDragging = dragHeight !== null;
    const animationClass = isDragging ? "" : "transition-all duration-300 ease-in-out";

    return (
        <div className="2xl:hidden">
            <div onClick={close}
                 className={`fixed inset-0 bg-black/60 z-[103] cursor-pointer transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}/>
            <div
                ref={sheetRef}
                style={isDragging ? {height: dragHeight} : undefined}
                className={`bg-white fixed inset-x-0 bottom-0 z-[104] flex flex-col ${animationClass} ${isOpen ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"} ${!isDragging && (expanded ? "h-dvh" : "h-[40dvh]")} ${expanded && !isDragging ? "rounded-none" : "rounded-t-2xl"}`}>
                <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
                     onLostPointerCapture={onPointerCancel}
                     onPointerCancel={onPointerCancel}
                     className="shrink-0 touch-none select-none cursor-ns-resize">
                    <button
                        onClick={() => setExpanded(v => !v)}
                        aria-label={expanded ? "کوچک کردن" : "بزرگ کردن"}
                        className="w-full flex justify-center pt-3 pb-1 cursor-ns-resize">
                        <span className="block w-10 h-1.5 rounded-full bg-light-gray"/>
                    </button>
                    <div
                        className="flex items-center justify-between border-b border-light-gray py-4 px-5 shrink-0">
                        <h3 className="font-semibold">مرتب سازی براساس</h3>
                        <button onClick={close} className="cursor-pointer" aria-label="بستن انتخاب طبقه بندی براساس">
                            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                 height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M6 18 17.94 6M18 18 6.06 6"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <ul className='px-5 text-dark-gray min-h-0 overflow-y-auto flex-1'>
                    {reviewSortOptions.map((r) => (
                        <li key={r.id}
                            className="not-last:border-b not-last:border-light-gray py-4">
                            <button aria-label={`انتخاب ${r.title}`} onClick={() => {
                                changeSort(r.target);
                                close();
                            }}
                                    className="cursor-pointer flex items-center justify-between w-full">
                                <span>{r.title}</span>
                                {r.target === currentSort &&
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 -0.5 25 25"
                                         fill="none">
                                        <path d="M5.5 12.5L10.167 17L19.5 8" stroke="#000000" strokeWidth="1.5"
                                              strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>}
                            </button>
                        </li>
                    ))}
                </ul>


            </div>
        </div>
    );
}

export default ReviewSortDropdown;