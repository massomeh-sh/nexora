import type {JSX} from 'react';
import type {ReactTypes, ReviewType} from "../types/product.ts";
import StarRating from "./StarRating.tsx";
import {dateFormater} from "../util/dateFormater.ts";
import CommentReactions from "./CommentReactions.tsx";
import {useReactToComment} from "../hooks/useReactToComment.ts";

interface MobileReviewProps {
    // Props here
    productId: string;
    reviewData: ReviewType;
    isAuthenticated: boolean;
}

function MobileReview({productId, reviewData, isAuthenticated}: MobileReviewProps): JSX.Element {
    const {mutate, isPending} = useReactToComment(productId);

    const handleReact = (reactType: ReactTypes) => {
        if (!isAuthenticated) return;
        mutate({id: productId, reviewId: reviewData._id, type: reactType});
    }

    return (
        <div className="flex flex-col gap-3 border border-light-gray p-4 rounded-lg w-72 h-64">
            <div className="flex items-center gap-3">
                <h3 className="space-x-2">
                    <span className="text-gray-700">{reviewData?.name ? reviewData?.name : "کاربر نکسورا"}</span>
                    <span className="text-light-gray text-lg">&bull;</span>
                </h3>
                <div className="bg-green-200 text-green-800 text-xs p-1 px-2 rounded-full">خریدار</div>
            </div>

            <StarRating productRating={reviewData.rating}/>

            <p className="text-dark-gray">{reviewData.comment}</p>

            <div className="flex items-center justify-between mt-auto">
                <p className="text-sm text-gray-400">{dateFormater(reviewData.createdAt ?? "")}</p>
                <CommentReactions reviewData={reviewData} isPending={isPending}
                                  handleReact={handleReact}/>
            </div>

        </div>
    );
}

export default MobileReview;