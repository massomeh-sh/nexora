import {useEffect, useState} from "react";


function getRemainingTime() {
    const now = new Date();

    const endDate = new Date();
    endDate.setDate(now.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);

    const difference = endDate.getTime() - now.getTime();

    return Math.max(0, Math.floor(difference / 1000));
}

function OfferTimer() {
    const [seconds, setSeconds] = useState(getRemainingTime);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(getRemainingTime());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return (
        <div dir="ltr" className="flex items-center justify-center gap-2 max-lg:gap-1 max-lg:mr-3">
            <span className="offer-timer">{String(hours).padStart(2, "0")}</span>
            <span>:</span>
            <span className="offer-timer">{String(minutes).padStart(2, "0")}</span>
            <span>:</span>
            <span className="offer-timer">{String(secs).padStart(2, "0")}</span>
        </div>
    );
}

export default OfferTimer;