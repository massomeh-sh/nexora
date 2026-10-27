import {type JSX, useState} from 'react';
import type {Product, ReviewSortType} from "../../types/product.ts";
import {useHashOverlay} from "../../hooks/useHashOverlay.ts";
import {sortReviews} from "@/utils/sortReviews.ts";
import Review from "../../UI/Review.tsx";
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import ReviewBottomSheet from "./ReviewBottomSheet.tsx";
import {useDispatch} from "react-redux";
import {showBottomSheet} from "@/store/ui/uiSlice.ts";
import {useLockBodyScroll} from "@/hooks/useLockBodyScroll.ts";

interface ReviewOverlayProps {
    // Props here
    product: Product;
}

function ReviewOverlay({product}: ReviewOverlayProps): JSX.Element {
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const [sortBy, setSortBy] = useState<ReviewSortType>("newest");
    const {close, isOpen} = useHashOverlay("reviews");
    const dispatch = useDispatch();

    const setReviewSort = (sort: ReviewSortType) => {
        setSortBy(sort);
    }

    const sortedReviews = sortReviews(sortBy, product);

    useLockBodyScroll(isOpen);

    return (
        <>
            <div
                className={`fixed 2xl:hidden h-dvh flex flex-col bg-white z-[102] inset-0 transition-all duration-300 ${isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-full opacity-0 pointer-events-none"}`}>

                <div className="shrink-0 flex items-center justify-between shadow-xs p-6">
                    <div className="flex items-center gap-3 font-semibold">
                        <button onClick={close} className="flex items-center gap-2 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M17.6492 11.2501L12.7904 6.53852L13.8346 5.46167L20.5774 12.0001L13.8346 18.5385L12.7904 17.4617L17.6492 12.7501H3V11.2501H17.6492Z"
                                      fill="#000000"/>
                            </svg>
                        </button>
                        <p className="flex gap-2 items-center">
                            <span>{product.numReviews}</span>
                            <span>دیدگاه</span>
                        </p>
                    </div>
                    <button onClick={() => dispatch(showBottomSheet("sortReview"))} className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <g id="Edit / Sort_Ascending">
                                <path id="Vector" d="M4 17H10M4 12H13M18 11V19M18 19L21 16M18 19L15 16M4 7H16"
                                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"></path>
                            </g>
                        </svg>
                    </button>
                </div>

                <ul className="p-6 overflow-y-auto flex-1 min-h-0">
                    {sortedReviews.map((r) => (
                        <li key={r._id} className="not-last:border-b-5 not-last:border-light-gray">
                            <Review productId={product._id} reviewData={r} isAuthenticated={isAuthenticated}/>
                        </li>
                    ))}
                </ul>
            </div>
            <ReviewBottomSheet currentSort={sortBy} changeSort={setReviewSort}/>
        </>);
}

export default ReviewOverlay;