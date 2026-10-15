import {type JSX} from 'react';
import {useHashOverlay} from "../../hooks/useHashOverlay.ts";
import StandPoint from "./StandPoint.tsx";
import {useLockBodyScroll} from "../../hooks/useLockBodyScroll.ts";


function StandPointOverlay(): JSX.Element {
    const {close, isOpen} = useHashOverlay("add-comment");


    useLockBodyScroll(isOpen);

    return (
        <div
            className={`fixed lg:hidden h-dvh flex flex-col bg-white z-[110] inset-0 transition-all duration-300 ${isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-full opacity-0 pointer-events-none"}`}>
            <StandPoint close={close}/>
        </div>
    );
}

export default StandPointOverlay;