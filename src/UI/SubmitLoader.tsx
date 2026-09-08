import type {JSX} from 'react';

interface SubmitLoaderProps {
    // Props here
    isSubmitting: boolean;
    btnText: string;
}

function SubmitLoader({isSubmitting, btnText}: SubmitLoaderProps): JSX.Element {
    return (
        <button disabled={isSubmitting}
                className="bg-primary-blue px-4 py-3 rounded-sm w-full text-white cursor-pointer active:bg-dark-gray">{btnText}
        </button>
    );
}

export default SubmitLoader;