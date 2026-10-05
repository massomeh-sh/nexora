import type {JSX} from 'react';

interface SubmitLoaderProps {
    // Props here
    isSubmitting: boolean;
    btnText: string;
    type?: "button" | "submit";
    onClick?: () => void;
}

function FormButton({isSubmitting, btnText, type = "submit", onClick}: SubmitLoaderProps): JSX.Element {
    return (
        <button type={type} disabled={isSubmitting} onClick={onClick} style={{minHeight: "48px"}}
                className="bg-primary-blue px-4 py-3 active:scale-95 flex items-center justify-center rounded-sm w-full text-white cursor-pointer active:bg-dark-gray text-center">{
            isSubmitting ? (
                <span className="flex justify-center items-center gap-1">
                    <span className="animate-bounce w-1.5 h-1.5 rounded-full bg-white"></span>
                    <span className="animate-bounce w-1.5 h-1.5 rounded-full bg-white [animation-delay:150ms]"></span>
                    <span className="animate-bounce w-1.5 h-1.5 rounded-full bg-white [animation-delay:300ms]"></span>
                </span>
            ) : btnText
        }
        </button>
    );
}

export default FormButton;