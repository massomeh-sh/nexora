import type {JSX} from 'react';
import Modal from "./Modal.tsx";

interface ConfirmationModalProps {
    // Props here
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
}

function ConfirmationModal({
                               open,
                               title,
                               message,
                               confirmText = "تایید",
                               cancelText = "انصراف",
                               onClose,
                               onConfirm
                           }: ConfirmationModalProps): JSX.Element {
    return (
        <Modal open={open} className="w-lg rounded-lg m-auto" close={onClose}>
            <div className="flex flex-col gap-5 p-5">
                <div className="flex items-center justify-between">
                    <p className="font-bold text-lg">{title}</p>
                    <button aria-label="بستن نمایش پیام" onClick={onClose}
                            className="text-dark-gray p-1.5 max-lg:p-0.5 cursor-pointer z-10">
                        <svg className="w-5 h-5" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
                                  d="M6 18 17.94 6M18 18 6.06 6"/>
                        </svg>
                    </button>
                </div>
                <div className="w-full h-[2px] bg-light-gray"/>
                <p className="text-darkest-gray">{message}</p>
                <div className="self-end flex items-center justify-center gap-3">
                    <button
                        className="cursor-pointer border border-primary-blue px-3 py-2  rounded-lg text-primary-blue"
                        onClick={onClose}>{cancelText}
                    </button>
                    <button onClick={onConfirm}
                            className="cursor-pointer text-white bg-primary-blue px-3 py-2 rounded-lg">{confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmationModal;