import type {JSX} from 'react';

interface PasswordRequierementsProps {
    // Props here
    password: string;
}

function PasswordRequirements({password}: PasswordRequierementsProps): JSX.Element {
    const requirements = [
        {
            text: "حداقل ۸ کاراکتر",
            valid: password.length >= 8,
        },
        {
            text: "حداقل یک حرف بزرگ انگلیسی",
            valid: /[A-Z]/.test(password),
        },
        {
            text: "حداقل یک حرف کوچک انگلیسی",
            valid: /[a-z]/.test(password),
        },
        {
            text: "حداقل یک عدد",
            valid: /[0-9]/.test(password),
        }
    ]

    return (
        <ul className="mt-2 space-y-2 text-sm">
            {requirements.map((requirement) => (
                <li key={requirement.text} className={requirement.valid ? "text-green-600" : "text-dark-gray"}>
                    <span className="inline-flex w-5">
                        {requirement.valid ? "\u2713" : "\u25CB"}
                    </span>
                    <span>{requirement.text}</span>
                </li>
            ))}
        </ul>
    );
}

export default PasswordRequirements;