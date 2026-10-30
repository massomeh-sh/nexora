import {type JSX, useState, type PointerEvent, useRef} from 'react';
import React from "react";

interface BottomSheetProps {
    // Props here
    children: React.ReactNode;
    header: React.ReactNode;
    isOpen: boolean;
    collapsed?: number;
    close: () => void;
}

function BottomSheet({children, header, isOpen, close, collapsed = 0.4}: BottomSheetProps): JSX.Element {
    const [expanded, setExpanded] = useState(false);
    const [dragHeight, setDragHeight] = useState<number | null>(null)
    const startY = useRef(0);
    const sheetRef = useRef<HTMLDivElement>(null);
    const startHeight = useRef(0);
    const lastHeight = useRef(0);
    const isPressed = useRef(false);
    const isDragRef = useRef(false);


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


        if (ratio < collapsed * 0.7) {
            close();
        } else if (ratio > (collapsed + 1) / 2) {
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
                 className={`fixed inset-0 bg-black/60 z-[102] cursor-pointer transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}/>
            <div
                ref={sheetRef}
                style={isDragging ? {height: dragHeight} : undefined}
                className={`bg-white fixed inset-x-0 bottom-0 z-[103] flex flex-col ${animationClass} ${isOpen ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"} ${!isDragging && (expanded ? "h-dvh" : `h-[${collapsed * 100}dvh]`)} ${expanded && !isDragging ? "rounded-none" : "rounded-t-2xl"}`}>
                <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
                     onLostPointerCapture={onPointerCancel}
                     onPointerCancel={onPointerCancel}
                     className="shrink-0 touch-none select-none cursor-ns-resize">
                    <div className="flex items-center justify-center">
                        <button
                            onClick={() => setExpanded(v => !v)}
                            aria-label={expanded ? "کوچک کردن" : "بزرگ کردن"}
                            className="w-fit pt-3 pb-1 cursor-pointer">
                            <span className="block w-10 h-1.5 rounded-full bg-light-gray"/>
                        </button>
                    </div>
                    {header}
                </div>
                <div className="min-h-0 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default BottomSheet;