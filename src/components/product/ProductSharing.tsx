import type {JSX} from 'react';
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import {hideProductSharingModal} from "../../store/ui/uiSlice.ts";
import {useDispatch} from "react-redux";
import AnimatedModal from "../../UI/AnimatedModal.tsx";

function ProductSharing(): JSX.Element {
    const isModalOpen = useAppSelector(state => state.ui.isProductSharingModalOpen);
    const dispatch = useDispatch();

    const handleCloseModal = () => {
        dispatch(hideProductSharingModal());
    }

    return (
        <AnimatedModal open={isModalOpen} close={handleCloseModal}
                       className="p-4 min-w-1/2 max-md:w-full md:w-1/3">
            <div className="flex flex-col ga-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg">اشتراک لینک محصول</h3>
                    <button className="cursor-pointer bg-primary-blue text-white p-1" onClick={handleCloseModal}>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                             height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18 17.94 6M18 18 6.06 6"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </AnimatedModal>
    );
}

export default ProductSharing;