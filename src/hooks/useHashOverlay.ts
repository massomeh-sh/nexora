import {useCallback, useEffect, useState} from "react";

export function useHashOverlay(hashName: string) {
    const hash = `#${hashName}`;
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => {
        setIsOpen(true);
        window.location.hash = hash;
    }, [hash]);


    const close = useCallback(() => {
        setIsOpen(false);
        if (window.location.hash === hash) {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
    }, [hash]);


    useEffect(() => {
        const handleHashChange = () => {
            setIsOpen(window.location.hash === hash);
        }
        handleHashChange();
        // We call it manually because it won't be called when component mount at first!

        window.addEventListener("hashchange", handleHashChange);

        return () => window.removeEventListener("hashchange", handleHashChange);
    }, [hash]);


    useEffect(() => {
        if (!isOpen) return;
        const closeSearchInput = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                close();
            }
        }

        document.addEventListener("keydown", closeSearchInput);

        return () => {
            document.removeEventListener("keydown", closeSearchInput);
        }
    }, [isOpen, close]);


    return {open, close, isOpen}
}