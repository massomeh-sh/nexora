import type {JSX} from 'react';

function CheckBox(): JSX.Element {
    return (
        <span
            className="size-5 rounded-md border-2 border-light-gray flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-primary-blue/40 peer-checked:bg-primary-blue peer-checked:border-primary-blue [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12.5L10 17.5L19 7.5" stroke="white" strokeWidth="3"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        </span>
    );
}

export default CheckBox;