import {type JSX, useEffect, useRef, useState} from 'react';
import {createPortal} from "react-dom";
import * as React from "react";

interface AnimatedModalProps {
    // Props here
    open: boolean;
    close: () => void;
    className?: string;
    children: React.ReactNode;
}

function AnimatedModal({open, close, className = "", children}: AnimatedModalProps): JSX.Element {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [visible, setVisible] = useState(false);


    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) return;

        if (open) {
            if (!modal.open) modal.showModal();

            requestAnimationFrame(() => {
                setVisible(true);
            });
        } else {
            setVisible(false);
            const timer = setTimeout(() => {
                if (modal.open) modal.close();
            }, 300);

            return () => {
                clearTimeout(timer);
            }
        }
    }, [modalRef, open]);


    const closeModal = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === modalRef.current) close();
    }

    const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
        e.preventDefault();
        close();
    }

    return createPortal(
        <dialog ref={modalRef} onClose={close} onClick={closeModal} onCancel={handleCancel}
                className={`${className} m-auto backdrop:bg-black/50 outline-none transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"}`}>
            {children}
        </dialog>
        , document.getElementById("modal")!);
}

export default AnimatedModal;