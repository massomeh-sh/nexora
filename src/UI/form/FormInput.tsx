import {type JSX} from 'react';
import * as React from "react";

interface InputFormProps extends React.HTMLProps<HTMLInputElement> {
    // Props here
    type?: string;
    id: string;
    label: string;
    error?: string;
}

function FormInput({type = "text", label, error, id, ...props}: InputFormProps): JSX.Element {
    return (
        <div className="flex flex-col">
            <div className="relative">
                <input type={type} id={id} {...props} placeholder=" "
                       className={`peer w-full rounded-sm border ${error ? "border-primary-red" : "border-gray-300"} px-4 py-3 outline-none ${error ? "focus:border-primary-red" : "focus:border-black"}`}/>
                <label htmlFor={id}
                       className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 bg-white px-1 ${error ? "text-primary-red" : "text-gray-300"} transition-all peer-focus:top-0 peer-focus:text-sm peer-focus:${error ? "text-primary-red" : "text-black"} peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:${error ? "text-primary-red" : "text-black"}`}>
                    {label}
                </label>
            </div>
            {error && <p className="text-sm text-primary-red mt-1">{error}</p>}
        </div>
    );
}

export default FormInput;

