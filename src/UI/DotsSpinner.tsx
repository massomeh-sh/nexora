import type {JSX} from 'react';

interface DotsSpinnerProps {
    // Props here
    className?: string;
}

function DotsSpinner({className = "bg-dark-gray"}: DotsSpinnerProps): JSX.Element {
    return (
        <div className="flex gap-1 items-center justify-center" role="status" aria-label="در حال بارگذاری">
            <span className={`h-1.5 w-1.5 rounded-full animate-pulse [animation-delay:-0.3s] ${className}`}/>
            <span className={`h-1.5 w-1.5  rounded-full animate-pulse [animation-delay:-0.15s] ${className}`}/>
            <span className={`h-1.5 w-1.5  rounded-full animate-pulse ${className}`}/>
        </div>
    );
}

export default DotsSpinner;