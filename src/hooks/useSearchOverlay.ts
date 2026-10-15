import {useEffect, useRef} from "react";
import {useHashOverlay} from "./useHashOverlay.ts";

export function useSearchOverlay() {
    const desktopSearchInputRef = useRef<HTMLInputElement | null>(null);
    const mobileSearchInputRef = useRef<HTMLInputElement | null>(null);

    const {isOpen: isSearchOpen, open, close} = useHashOverlay("search");

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isShortcut =
                ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") ||
                e.key === "ن";

            if (!isShortcut) return;

            e.preventDefault();
            open();
            desktopSearchInputRef.current?.focus();
            window.dispatchEvent(new CustomEvent("close-all-menus"));
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    useEffect(() => {
        if (isSearchOpen) return;
        desktopSearchInputRef.current?.blur();
        mobileSearchInputRef.current?.blur();
        if(mobileSearchInputRef.current) mobileSearchInputRef.current.value = "";
    }, [isSearchOpen]);

    return {isSearchOpen, close, open, mobileSearchInputRef, desktopSearchInputRef};
}