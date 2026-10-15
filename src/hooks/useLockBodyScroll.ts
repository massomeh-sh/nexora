import {useEffect} from "react";

export function useLockBodyScroll(isOpen: boolean) {
    useEffect(() => {
        if (!isOpen) return;
        const media = window.matchMedia("(min-width: 1536px)");

        const updateScroll = () => {
            // "" اسکرول عادی
            // غیر فعال کردن اسکرول با hidden
            document.body.style.overflow = media.matches ? "" : "hidden";
        }

        updateScroll();
        media.addEventListener("change", updateScroll);

        return () => {
            media.removeEventListener("change", updateScroll);
            document.body.style.overflow = "";
        };
    }, [isOpen]);
}