import {type JSX, useEffect, useRef} from 'react';
import * as React from 'react';
import {createPortal} from "react-dom";

interface ModalProps {
    // Props here
    open?: boolean;
    close?: () => void;
    children: React.ReactNode;
}

function Modal({open, close, children}: ModalProps): JSX.Element {
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const modal = modalRef.current;
        if (!open || !modal) return;
        if (open) {
            modal.showModal();
        }

        return () => {
            modal.close();
        }
    }, [modalRef, open]);

    const closeModal = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (!modalRef.current) return;
        if (e.target === modalRef.current) {
            modalRef.current?.close();
        } else return;
    }

    return createPortal(<dialog ref={modalRef} onClose={close} onClick={closeModal}
                                className="m-auto w-[90%] max-w-6xl max-h-[90%] overflow-y-auto scrollbar-none border border-gray-200 bg-white outline-none backdrop:h-screen backdrop:bg-black/50">
        {children}
    </dialog>, document.getElementById("modal")!)
}

export default Modal;