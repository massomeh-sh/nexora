import {type JSX, useState} from 'react';
import type {Product, ReviewSortType, ReviewType} from "../../types/product.ts";
import StarRating from "../../UI/StarRating.tsx";
import Review from "../../UI/Review.tsx";
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import {useNavigate} from "react-router";
import {FaStar} from "react-icons/fa";
import MobileReview from "../../UI/MobileReview.tsx";
import ProductEmptyReview from "./ProductEmptyReview.tsx";
import {sortReviews} from "../../util/sortReviews.ts";
import {reviewSortOptions} from "../../constants/ReviewSortOptions.ts";

interface ProductReviewProps {
    // Props here
    product: Product;
}

function ProductReview({product}: ProductReviewProps): JSX.Element {
    const [sortBy, setSortBy] = useState<ReviewSortType>("newest");

    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const navigate = useNavigate();
    const total: number = product.reviews.length;


    const handleAddStandPoint = () => {
        if (!isAuthenticated) {
            navigate("/auth");
            return;
        }

        window.location.hash = "add-comment";
    }

    const handleShowAllReviews = () => {
        window.location.hash = "reviews";
    }

    const sortedReviews = sortReviews(sortBy, product);


    return (
        <>
            <div className="grid grid-cols-[1fr_4fr] gap-12 max-2xl:gap-6 max-2xl:flex max-2xl:flex-col">

                <div
                    className="2xl:sticky 2xl:top-40 flex flex-col max-2xl:grid max-2xl:grid-cols-3 max-md:grid-cols-2 self-start gap-5 max-2xl:w-full max-2xl:border-b max-2xl:pb-8 max-2xl:border-light-gray">
                    <div
                        className="space-y-3 max-2xl:flex max-2xl:flex-col max-2xl:items-center max-2xl:justify-center max-2xl:border-l max-2xl:border-light-gray max-2xl:pl-4">
                        {product.rating > 0 && <p className="space-x-1">
                            <span className="font-medium text-3xl">{product.rating}</span>
                            <span className="text-dark-gray">از 5</span>
                        </p>}
                        <div className="flex gap-2 max-2xl:flex-col">
                            <StarRating productRating={product.rating}/>
                            {product.rating > 0 ?
                                <p className="-mt-1 text-sm text-dark-gray max-2xl:text-center">از
                                    مجموع <span>{product.reviews.length}</span> دیدگاه</p> :
                                <p className="-mt-1 text-sm text-dark-gray">هنوز امتیازی ثبت نشده است</p>}
                        </div>
                    </div>

                    <ul className="">
                        {Array.from({length: 5}).map((_, i: number) => {
                            const star = 5 - i;
                            const count = product.reviews.filter((r) => r.rating === star).length;
                            const percent = total ? (count / total) * 100 : 0;

                            return (
                                <li key={i} className="flex items-center justify-center gap-3 text-dark-gray">
                                    <div className="flex gap-1 items-center justify-start w-8">
                                        <span>{star}</span>
                                        <FaStar className="text-yellow-400"/>
                                    </div>
                                    <div className="relative bg-light-gray overflow-hidden w-full h-1.5 rounded-full">
                                        <div style={{width: `${percent}%`}}
                                             className="absolute top-0 right-0 bg-yellow-400 h-full rounded-full"/>
                                    </div>
                                    <span className="w-6">{count}</span>
                                </li>
                            )
                        })}
                    </ul>

                    <div
                        className="w-full space-y-3 max-md:pt-4 max-2xl:flex max-2xl:justify-center md:items-center max-2xl:flex-col max-md:col-span-2">
                        <p className="text-sm text-dark-gray">شما هم درباره این کالا دیدگاه ثبت کنید</p>
                        <button onClick={handleAddStandPoint}
                                className="border border-primary-blue p-1.5 rounded-lg text-primary-blue cursor-pointer w-full">ثبت
                            دیدگاه
                        </button>
                    </div>

                </div>


                <div className="md:hidden flex flex-col gap-8">


                    <div className="flex items-center justify-between text-sm">
                        <h2 className="text-lg">دیدگاه کاربرها</h2>
                        <button onClick={handleShowAllReviews}
                                className="flex items-center gap-1 justify-center cursor-pointer">
                            <span>مشاهده {total} دیدگاه</span>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 fill="#000000" version="1.1" id="Layer_1" width="18" height="18"
                                 viewBox="0 0 100 100" enableBackground="new 0 0 100 100">
                                <g>
                                    <path
                                        d="M33.934,54.458l30.822,27.938c0.383,0.348,0.864,0.519,1.344,0.519c0.545,0,1.087-0.222,1.482-0.657   c0.741-0.818,0.68-2.083-0.139-2.824L37.801,52.564L64.67,22.921c0.742-0.818,0.68-2.083-0.139-2.824   c-0.817-0.742-2.082-0.679-2.824,0.139L33.768,51.059c-0.439,0.485-0.59,1.126-0.475,1.723   C33.234,53.39,33.446,54.017,33.934,54.458z"/>
                                </g>
                            </svg>
                        </button>
                    </div>

                    <div className="flex gap-2 overflow-hidden overflow-x-auto scrollbar-none scroll-smooth">
                        {sortedReviews.length > 0 ? sortedReviews.map((r: ReviewType, index) => (
                                <ul key={r._id} className="flex gap-2">
                                    <li key={r._id}>
                                        <MobileReview
                                            productId={product._id}
                                            isAuthenticated={isAuthenticated}
                                            reviewData={r}/>
                                    </li>
                                    {index === sortedReviews.length - 1 && (
                                        <li className="w-36 my-auto flex flex-col gap-2 items-center justify-center">
                                            <button onClick={handleShowAllReviews}
                                                    className="border rounded-full p-2 cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd"
                                                          d="M6.3508 12.7499L11.2096 17.4615L10.1654 18.5383L3.42264 11.9999L10.1654 5.46148L11.2096 6.53833L6.3508 11.2499L21 11.2499L21 12.7499L6.3508 12.7499Z"
                                                          fill="#080341"/>
                                                </svg>
                                            </button>
                                            <span>مشاهده همه</span>
                                        </li>)}
                                </ul>)) :
                            <ProductEmptyReview/>
                        }
                    </div>

                </div>

                <div className="flex flex-col gap-6 max-md:hidden">

                    <div className="flex justify-between items-center">

                        <div
                            className="flex items-center gap-5">

                            <button className="flex items-center gap-1 text-gray-700 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none">
                                    <g id="Edit / Sort_Ascending">
                                        <path id="Vector" d="M4 17H10M4 12H13M18 11V19M18 19L21 16M18 19L15 16M4 7H16"
                                              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                    </g>
                                </svg>
                                <span>مرتب سازی:</span>
                            </button>

                            <ul className="flex items-center gap-6">
                                {reviewSortOptions.map((r) => (
                                    <li key={r.id}>
                                        <button onClick={() => setSortBy(r.target)}
                                                className={`cursor-pointer ${sortBy === r.target ? "text-primary-blue" : "text-dark-gray"}`}>{r.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                        </div>

                        <p className="text-dark-gray space-x-0.5">
                            <span>{total}</span>
                            <span>دیدگاه</span>
                        </p>
                    </div>


                    <div>
                        {sortedReviews.length > 0 ? sortedReviews.map((r: ReviewType) => (
                                <ul key={r._id}
                                    className="md:not-last:border-b md:not-last:border-light-gray 2xl:first:border-t lg:first:border-light-gray">
                                    <li>
                                        <Review
                                            productId={product._id}
                                            isAuthenticated={isAuthenticated}
                                            reviewData={r}/>
                                    </li>
                                </ul>)) :
                            <ProductEmptyReview/>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductReview;