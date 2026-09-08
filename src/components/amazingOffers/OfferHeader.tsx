import {type JSX} from 'react';
import OfferTimer from "./OfferTimer.tsx";
import {Link} from "react-router";

function OfferHeader(): JSX.Element {
    return (
        <header
            className="flex flex-col max-lg:flex-row max-lg:py-3 max-lg:px-2 max-lg:w-full max-lg:gap-2 items-center justify-center max-lg:justify-start gap-5 w-1/3 text-white px-5">
            <svg className="w-12 h-12 max-lg:w-10 max-lg:h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="none">
                <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 15L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M14.4945 14.5H14.5035" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M9.49451 9.5H9.50349" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>
            <h2 className="italic text-2xl max-lg:text-lg">شگفت انگیز</h2>
            <OfferTimer/>
            <Link to="/incredible-offers"
                  className="flex items-center justify-center gap-3 text-darkest-gray bg-light-gray rounded-lg p-1 max-lg:hidden">
                <span>مشاهده همه</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24"
                     viewBox="0 0 24 24">
                    <path
                        d="M1.293,12.707a1,1,0,0,1,0-1.414l5-5A1,1,0,0,1,7.707,7.707L4.414,11H22a1,1,0,0,1,0,2H4.414l3.293,3.293a1,1,0,1,1-1.414,1.414Z"/>
                </svg>
            </Link>
            <Link to="/incredible-offers" className="lg:hidden flex items-center justify-center mr-auto">
                <span>همه</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 8L10 12L14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </svg>
            </Link>
        </header>
    );
}

export default OfferHeader;