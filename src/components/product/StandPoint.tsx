import {useEffect, useState} from 'react';
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {productQuery} from "../../api/productQueries.ts";
import {useSearchParams} from "react-router";
import DotsSpinner from "../../UI/DotsSpinner.tsx";
import DisplayStandPointOption from "./DisplayStandPointOption.tsx";
import StarRating from "../../UI/StarRating.tsx";
import {createProductReview} from "../../api/products.ts";
import {ApiError} from "../../api/apiClient.ts";
import {toast} from "sonner";

interface StandPointProps {
    // Props here
    close: () => void;
}

function StandPoint({close}: StandPointProps) {
    const [rating, setRating] = useState<number>(0);
    const [showOptions, setShowOptions] = useState(false);
    const [selectedOption, setSelectedOption] = useState("named");
    const [standPointText, setStandPointText] = useState("");
    const userData = useAppSelector(state => state.user)
    const standPointTextLength = standPointText.length;

    const [searchParams] = useSearchParams();
    const productId = searchParams.get("product_id") || "";
    const {data, isLoading} = useQuery(productQuery(productId));
    const product = data?.data;


    const {mutate} = useMutation({
        mutationKey: ["product", productId],
        mutationFn: createProductReview,
        onError: (err) => {
            const error = err instanceof ApiError ? err.message : "خطا در حذف سبد خرید"
            toast.error(error);
            close();
        },
        onSuccess: (data) => {
            toast.success(data.message);
            close();
        }
    })

    useEffect(() => {
        if (!showOptions) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            event.preventDefault();  //برای اینکه مرورگر به صورت دیفالت dialog رو نبنده
            event.stopPropagation(); //برای اینکه ایونت بعد ازینکه تو capturing phase انجام شد به window نرسد و ایونت داخل useHashOverlay اجرا نشود
            setShowOptions(false);
        }

        document.addEventListener("keydown", handleEscape, true);

        return () => {
            document.removeEventListener("keydown", handleEscape, true);
        }
    })

    const updateRating = (index: number) => {
        setRating(index);
    }

    const handleSubmitStandPoint = () => {
        mutate({
            productId: product?._id ?? "",
            rating,
            comment: standPointText,
            isAnonymous: selectedOption === "anonymous",
        });
    }

    if (isLoading) {
        return <DotsSpinner className="m-auto"/>;
    }

    if (!product) return null;


    return (
        <>
            <div className="relative flex flex-col gap-2 items-start h-full">
                <h3 className="text-lg w-full border-b-4 border-light-gray pb-4 p-5">
                    <button onClick={() => {
                        close()
                    }}
                            className="flex items-center font-semibold gap-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 1024 1024">
                            <path fill="#000000"
                                  d="M754.752 480H160a32 32 0 1 0 0 64h594.752L521.344 777.344a32 32 0 0 0 45.312 45.312l288-288a32 32 0 0 0 0-45.312l-288-288a32 32 0 1 0-45.312 45.312L754.752 480z"/>
                        </svg>
                        <span>ثبت دیدگاه</span>
                    </button>
                </h3>

                <div className="w-full">
                    <div className="flex gap-3 w-full px-5 py-3">
                        <img className="w-20 h-20 shrink-0 border border-light-gray rounded-lg overflow-hidden"
                             alt={product.name}
                             src={`${import.meta.env.VITE_API_BASE_URL}${product.images?.[0]}`}/>
                        <p className="truncate text-lg ">{product.name}</p>
                    </div>
                    <div className="border-b border-light-gray mx-5"/>
                </div>

                <div className="flex flex-col w-full pb-8 px-5">

                    <div
                        className="flex flex-col gap-2 py-3 my-3 items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-lg">
                        <p className="space-x-1 text-lg">
                            <span className="text-gray-700 font-semibold">امتیاز شما به این کالا</span>
                            <span className="text-primary-red">&#9733;</span>
                        </p>
                        <StarRating rating={rating} updateRating={updateRating}/>
                    </div>

                    <div className="flex items-center justify-between">
                        <h4 className="text-lg space-x-1">
                            <span>متن دیدگاه:</span>
                            <span className="text-primary-red">&#9733;</span>
                        </h4>
                        {standPointTextLength >= 3 &&
                            <p className="bg-green-50 text-green-700 text-sm p-2 rounded-full">{standPointTextLength >= 15 ? "ممنون که دیدگاه مفیدی برای کاربران مینویسی" : "پیشنهاد میکنیم دیدگاهت رو کامل تر کنی"}</p>}
                    </div>

                    <textarea rows={4} maxLength={500}
                              value={standPointText}
                              onChange={(e) => setStandPointText(e.target.value)}
                              placeholder="نظر خود را درباره این کالا با کاربران دیگر به اشتراک بگذارید.."
                              className="outline-none px-4 py-3 placeholder:text-text-dark-gray text-darkest-gray focus:border-blue-300 caret-blue-300  border-2 border-light-gray hover:border-gray-300 resize-none rounded-lg mt-3"/>

                    <div
                        className="flex items-center justify-between border-b border-x rounded-br-lg rounded-bl-lg p-3 border-light-gray">
                        <p className="text-sm">{selectedOption === "named" ? userData.name : "کاربر نکسورا"}</p>
                        <button
                            onClick={() => setShowOptions(true)}
                            className="bg-lightest-gray text-dark-gray text-sm py-2 px-3 flex gap-1 rounded-full cursor-pointer">
                            <span>{selectedOption === "named" ? "ارسال با نام شما" : "ارسال به صورت ناشناس"}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                 fill="none">
                                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="w-full space-y-3 p-5 mt-auto border-t-4 border-light-gray">
                    <button disabled={standPointTextLength < 5 || rating === 0} onClick={handleSubmitStandPoint}
                            className={`bg-light-gray transition-colors duration-300 ${standPointTextLength >= 5 && rating !== 0 ? "bg-primary-blue cursor-pointer" : ""} text-white rounded-lg w-full p-3 text-lg`}>ثبت
                        دیدگاه
                    </button>
                    <p className="text-dark-gray text-sm text-center tracking-widest">ثبت این دیدگاه به معنی
                        موافقت
                        با <span
                            className="text-primary-blue">قوانین نکسورا</span>است.
                    </p>
                </div>

            </div>

            {showOptions && (
                <div onClick={() => setShowOptions(false)} className="fixed inset-0 bg-black/50"/>)}

            <div
                className={`flex flex-col w-full ${showOptions ? "lg:opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} absolute lg:top-1/2 lg:-translate-y-1/2 lg:inset-x-0 max-lg:bottom-0 max-lg:inset-x-0 border border-light-gray rounded-lg bg-white max-lg:transition-all max-lg:duration-300 ${showOptions ? "max-lg:opacity-100 max-lg:translate-y-0" : "max-lg:opacity-0 max-lg:translate-y-full"}`}>

                <div className="flex items-center p-5 justify-between border-b border-light-gray">
                    <h3 className="text-lg font-semibold">نحوه ی نمایش دیدگاه ها</h3>
                    <button onClick={() => setShowOptions(false)}
                            className="cursor-pointer">
                        <svg className="w-5 h-5" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                             viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18 17.94 6M18 18 6.06 6"/>
                        </svg>
                    </button>
                </div>

                <DisplayStandPointOption selectedOption={selectedOption}
                                         setSelectedOption={setSelectedOption}/>


            </div>
        </>
    );
}

export default StandPoint;