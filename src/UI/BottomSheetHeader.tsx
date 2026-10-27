import type {JSX} from 'react';

interface BottomSheetHeaderProps {
    // Props here
    close: () => void;
    title: string;
}

function BottomSheetHeader({close, title}: BottomSheetHeaderProps): JSX.Element {
    return (
        <div
            className="flex items-center justify-between border-b border-light-gray py-4 px-5 shrink-0">
            <h3 className="font-semibold">{title}</h3>
            <button onClick={close} className="cursor-pointer" aria-label="بستن انتخاب طبقه بندی براساس">
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                     height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M6 18 17.94 6M18 18 6.06 6"></path>
                </svg>
            </button>
        </div>
    );
}

export default BottomSheetHeader;