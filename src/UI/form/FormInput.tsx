import {type JSX} from 'react';
import * as React from "react";

interface InputFormProps extends React.HTMLProps<HTMLInputElement> {
    // Props here
    type?: string;
    id: string;
    label: string;
    error?: string;
    className?: string;
}

function AuthFormInput({type = "text", label, error, id, className = "", ...props}: InputFormProps): JSX.Element {
    return (
        <div className={`flex flex-col max-md:text-sm ${className}`}>
            <div>
                <label htmlFor={id}
                       className={`pointer-events-none bg-white px-1 ${error ? "text-primary-red" : ""} transition-all peer-focus:${error ? "text-primary-red" : "text-black"} peer-[:not(:placeholder-shown)]:${error ? "text-primary-red" : "text-black"}`}>
                    {label}
                </label>
                <input type={type} id={id} {...props}
                       className={`peer w-full mt-1.5 rounded-lg max-md:placeholder:text-[12px] focus:bg-light-gray focus:ring-3 focus:ring-primary-blue/70 border focus:border-primary-blue ${error ? "border-primary-red" : "border-gray-300"} px-4 py-3 outline-none ${error ? "focus:border-primary-red" : "focus:border-black"}`}/>
            </div>
            {error && <p className="text-sm max-md:text-[12px] text-primary-red mt-1">{error}</p>}
        </div>
    );
}

export default AuthFormInput;

