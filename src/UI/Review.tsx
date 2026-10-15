import {type JSX, useEffect, useRef, useState} from 'react';
import {dateFormater} from "../util/dateFormater.ts";
import StarRating from "./StarRating.tsx";
import type {ReactTypes, ReviewType} from "../types/product.ts";
import Notification from "./Notification.tsx";
import {useReactToComment} from "../hooks/useReactToComment.ts";
import CommentReactions from "./CommentReactions.tsx";

interface UserReviewProps {
    // Props here
    productId: string;
    reviewData: ReviewType;
    isAuthenticated: boolean;
}

function Review({reviewData, isAuthenticated, productId}: UserReviewProps): JSX.Element {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showNotification, setShowNotification] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    const {mutate, isPending} = useReactToComment(productId);


    const handleShowNotification = () => {
        setShowDropdown(false);
        setShowNotification(true);

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            setShowNotification(false);
        }, 5000)
    }

    const handleCloseNotification = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setShowNotification(false);
    }

    useEffect(() => {
        if (!showDropdown) return;

        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        }

    }, [showDropdown, dropdownRef]);

    const handleReact = (reactType: ReactTypes) => {
        if (!isAuthenticated) return;
        mutate({id: productId, reviewId: reviewData._id, type: reactType});
    }

    return (
        <div className="flex flex-col gap-3 py-6">

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                    <h3 className="space-x-2 text-lg">
                        <span>{reviewData?.name ? reviewData?.name : "کاربر نکسورا"}</span>
                        <span className="text-light-gray">&bull;</span>
                    </h3>
                    <div className="bg-green-200 text-green-800 text-sm p-1 px-2 rounded-full">خریدار</div>
                </div>

                <div className="flex items-start gap-1 text-dark-gray">
                    <p className="text-sm">{dateFormater(reviewData.createdAt ?? "")}</p>
                    <div ref={dropdownRef} className="relative">
                        <button onClick={() => setShowDropdown(true)} className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 fill="currentColor" width="18" height="18" viewBox="0 0 32 32"
                                 enableBackground="new 0 0 32 32" id="Glyph" version="1.1">
                                <path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z"
                                      id="XMLID_294_"/>
                                <path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z"
                                      id="XMLID_295_"/>
                                <path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z"
                                      id="XMLID_297_"/>
                            </svg>
                        </button>
                        {showDropdown && (<div
                            className="absolute top-full z-10 left-1.5 bg-white shadow-[0_0_5px_rgba(0,0,0,0.2)] rounded-lg w-44 py-2">
                            <button
                                onClick={handleShowNotification}
                                className="flex items-center justify-center gap-1 hover:bg-lightest-gray w-full py-3 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                     viewBox="-3.5 0 32 32" version="1.1">

                                    <title>flag</title>
                                    <desc>Created with Sketch Beta.</desc>
                                    <defs>

                                    </defs>
                                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                        <g id="Icon-Set" transform="translate(-208.000000, -723.000000)" fill="#D32F2F">
                                            <path
                                                d="M231,744 C231,744.552 230.552,745 230,745 L225,745 L225,732 L230,732 C230.552,732 231,732.448 231,733 L231,744 L231,744 Z M223,741 C223,741.553 222.552,742 222,742 L214,742 L214,728 L222,728 C222.552,728 223,728.448 223,729 L223,741 L223,741 Z M212,752 C212,752.553 211.552,753 211,753 C210.448,753 210,752.553 210,752 L210,726 C210,725.448 210.448,725 211,725 C211.552,725 212,725.448 212,726 L212,752 L212,752 Z M231,730 L225,730 L225,728 C225,726.896 224.104,726 223,726 L214,726 L214,725 C214,723.896 213.104,723 212,723 L210,723 C208.896,723 208,723.896 208,725 L208,753 C208,754.104 208.896,755 210,755 L212,755 C213.104,755 214,754.104 214,753 L214,744 L223,744 L223,745 C223,746.104 223.94,747 225,747 L231,747 C232.104,747 233,746.104 233,745 L233,732 C233,730.896 232.104,730 231,730 L231,730 Z"
                                                id="flag">
                                            </path>
                                        </g>
                                    </g>
                                </svg>

                                <span className="text-darkest-gray">گزارش این دیدگاه</span>
                            </button>
                        </div>)}
                    </div>
                </div>
            </div>

            <StarRating productRating={reviewData.rating}/>
            <div className="flex items-center justify-between">
                <p>{reviewData.comment}</p>
                <CommentReactions reviewData={reviewData} isPending={isPending}
                                  handleReact={handleReact}/>
            </div>
            {showNotification && (
                <Notification onClose={handleCloseNotification} message="گزارش شما با موفقیت ارسال شد."/>
            )}
        </div>
    );
}

export default Review;