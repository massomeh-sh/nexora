import {type JSX, useState} from 'react';
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import {useDispatch} from "react-redux";
import AnimatedModal from "../../UI/modal/AnimatedModal.tsx";
import {share} from "../../constants/shareLinks.ts";
import type {ShareBtn, ShareItem} from "../../types/shareItems.ts";
import {toast} from "sonner";
import {hideModal} from "../../store/ui/uiSlice.ts";


function ProductSharingModal(): JSX.Element {
    const currentModal = useAppSelector(state => state.ui.currentModal);
    const dispatch = useDispatch();
    const [selectedBtn, setSelectedBtn] = useState<ShareBtn>("telegram");

    const productUrl = window.location.href;

    const handleCloseModal = () => {
        dispatch(hideModal());
    }


    const handleCopy = async (url: string) => {
        await navigator.clipboard.writeText(url);
        toast.success("Copied!");
    }

    return (
        <AnimatedModal open={currentModal === "shareLink"} close={handleCloseModal}
                       className="p-4 max-md:w-full max-lg:w-1/2 lg:w-1/3">
            <div className="flex flex-col gap-5">
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

                <div className="flex items-center gap-3">
                    {share.map((i: ShareItem) => {
                        const Icon = i.icon;
                        return (
                            <button onClick={() => setSelectedBtn(i.name)} key={i.id} aria-label={i.name}
                                    className={`rounded-lg p-1 cursor-pointer transition-transform duration-300 hover:-translate-y-2 ${selectedBtn === i.name ? "text-white bg-primary-blue -translate-y-2" : "text-primary-blue bg-light-gray"}`}>
                                <Icon/>
                            </button>
                        )
                    })}
                </div>

                {share.map((i) => i.name === selectedBtn && (
                    <div className="flex" key={i.id}>
                        <input name="ProductLink" id="productLink" dir="ltr" readOnly defaultValue={`${i.url}${productUrl}`} type="text"
                               className="w-3/4 outline-none border border-gray-300 p-2"/>
                        <button onClick={() => handleCopy(`${i.url}${productUrl}`)}
                                className="text-white bg-primary-blue mr-auto py-2 px-4 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-500">کپی
                            لینک
                        </button>
                    </div>
                ))}
            </div>

        </AnimatedModal>
    )
        ;
}

export default ProductSharingModal;