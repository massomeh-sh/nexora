import {type JSX, useState} from 'react';
import topBanner from "../assets/بنر تبلیغاتی.gif";
import {Link} from "react-router";

function TopBanner(): JSX.Element {
    const [showBanner, setShowBanner] = useState(() => {
        return localStorage.getItem("bannerClosed") !== "true";
    });

    const onCloseBanner = () => {
        setShowBanner(false);
        localStorage.setItem("bannerClosed", "true");
    }

    return (
        <>
            {showBanner && <Link to="/" className="relative w-full z-50 cursor-pointer" role="img">
                <img src={topBanner} alt="بنر تبلیغاتی" className="w-full h-[35px] object-cover block"/>
                <button
                    onClick={onCloseBanner}
                    className="absolute top-1/2 -translate-y-1/2 right-5 bg-black text-white cursor-pointer rounded-sm">
                    <svg className="w-5 h-5 max-md:w-3 max-md:h-3" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button>
            </Link>}
        </>
    );
}

export default TopBanner;