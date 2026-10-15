import {type JSX} from 'react';

interface NotificationProps {
    message: string;
    onClose?: () => void;
}

function Notification({message, onClose}: NotificationProps): JSX.Element {

    return (
        <div
            className={`bg-black text-white w-xs fixed top-2 left-1/2 -translate-x-1/2 z-[9999] flex items-center justify-between px-5 py-3 rounded-lg`}>
            <p>{message}</p>
            <button onClick={onClose} className="text-sm text-primary-blue cursor-pointer">باشه</button>
        </div>
    );
}

export default Notification;