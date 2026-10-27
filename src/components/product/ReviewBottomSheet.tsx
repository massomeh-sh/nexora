import {type JSX} from 'react';
import {reviewSortOptions} from "@/constants/ReviewSortOptions.ts";
import type {ReviewSortType} from "@/types/product.ts";
import BottomSheet from "@/UI/BottomSheet.tsx";
import {useAppSelector} from "@/hooks/useAppSelector.ts";
import {useDispatch} from "react-redux";
import {hideBottomSheet} from "@/store/ui/uiSlice.ts";
import BottomSheetHeader from "@/UI/BottomSheetHeader.tsx";

interface ProductSortDropdownProps {
    // Props here
    currentSort: string;
    changeSort: (newSort: ReviewSortType) => void;
}


function ReviewBottomSheet({currentSort, changeSort}: ProductSortDropdownProps): JSX.Element {
    const currentBottomSheet = useAppSelector(state => state.ui.currentBottomSheet);
    const dispatch = useDispatch();

    const closeBottomSheet = () => dispatch(hideBottomSheet());

    return (
        <BottomSheet isOpen={currentBottomSheet === "sortReview"} close={closeBottomSheet} header={
            <BottomSheetHeader close={closeBottomSheet} title="مرتب سازی براساس"/>
        }>
            <ul className='px-5 text-dark-gray'>
                {reviewSortOptions.map((r) => (
                        <li key={r.id}
                            className="not-last:border-b not-last:border-light-gray py-4">
                            <button aria-label={`انتخاب ${r.title}`} onClick={() => {
                                changeSort(r.target);
                                closeBottomSheet();

                            }}
                                    className="cursor-pointer flex items-center justify-between w-full">
                                <span>{r.title}</span>
                                {r.target === currentSort &&
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 -0.5 25 25"
                                         fill="none">
                                        <path d="M5.5 12.5L10.167 17L19.5 8" stroke="#000000" strokeWidth="1.5"
                                              strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>}
                            </button>
                        </li>
                    )
                )
                }
            </ul>
        </BottomSheet>
    )
        ;
}

export default ReviewBottomSheet;


