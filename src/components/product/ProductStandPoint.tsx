import Modal from "../../UI/modal/Modal.tsx";
import {useHashOverlay} from "../../hooks/useHashOverlay.ts";
import StandPoint from "./StandPoint.tsx";
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";


function ProductStandPoint() {
    const {close, isOpen} = useHashOverlay("add-comment");


    const isDesktop = useMediaQuery("(min-width: 1024px)");


    if (isDesktop) {
        return (
            <>
                <Modal open={isOpen} close={() => {
                    close()
                }}
                       className="m-auto w-lg rounded-lg max-lg:hidden">
                    <StandPoint close={close}/>
                </Modal>
            </>
        );
    }

    return (
        <div
            className={`fixed h-dvh flex flex-col bg-white z-[110] inset-0 transition-all duration-300 ${isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-full opacity-0 pointer-events-none"}`}>
            {isOpen && <StandPoint close={close}/>}
        </div>
    );
}

export default ProductStandPoint;