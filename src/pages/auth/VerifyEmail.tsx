import {type JSX, useEffect, useRef} from 'react';
import {Link, useParams} from "react-router";
import {useMutation} from "@tanstack/react-query";
import {verifyEmail} from "../../api/auth.ts";
import {ApiError} from "../../api/apiClient.ts";

function VerifyEmailPage(): JSX.Element {
    const {token} = useParams();
    const hasVerified = useRef(false);

    const {mutate, data, isPending, isSuccess, isError, error} = useMutation({
        mutationFn: verifyEmail
    })

    useEffect(() => {
        if (!token || hasVerified.current) return;

        hasVerified.current = true;
        mutate(token)
    }, [token, mutate]);

    if (isPending) {
        return (
            <div className="text-center">
                <p>در حال تایید ایمیل...</p>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center gap-2 text-center pb-2 max-lg:w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="50"
                     height="50" viewBox="0 0 512 512" version="1.1">
                    <title>success</title>
                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g id="add-copy" fill="#00a63e" transform="translate(42.666667, 42.666667)">
                            <path
                                d="M213.333333,3.55271368e-14 C95.51296,3.55271368e-14 3.55271368e-14,95.51296 3.55271368e-14,213.333333 C3.55271368e-14,331.153707 95.51296,426.666667 213.333333,426.666667 C331.153707,426.666667 426.666667,331.153707 426.666667,213.333333 C426.666667,95.51296 331.153707,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,384 C119.227947,384 42.6666667,307.43872 42.6666667,213.333333 C42.6666667,119.227947 119.227947,42.6666667 213.333333,42.6666667 C307.43872,42.6666667 384,119.227947 384,213.333333 C384,307.43872 307.438933,384 213.333333,384 Z M293.669333,137.114453 L323.835947,167.281067 L192,299.66912 L112.916693,220.585813 L143.083307,190.4192 L192,239.335893 L293.669333,137.114453 Z"
                                id="Shape">
                            </path>
                        </g>
                    </g>
                </svg>
                <h2 className="text-lg">{data?.message}</h2>
                <p className="text-sm text-dark-gray">حساب کاربری شما در نکسورا فعال شد. اکنون می‌توانید وارد حساب خود
                    شوید.</p>
                <Link to="/auth"
                      className="bg-primary-blue px-4 py-3 rounded-sm w-full text-white cursor-pointer active:bg-dark-gray mt-2">ورود
                    به حساب</Link>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center gap-2 text-center pb-2 max-lg:w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 14 14">
                    <g fillRule="evenodd">
                        <path d="M0 7a7 7 0 1 1 14 0A7 7 0 0 1 0 7z" fill="#fff"/>
                        <path
                            d="M13 7A6 6 0 1 0 1 7a6 6 0 0 0 12 0z"
                            style={{fill: 'var(--svg-status-bg, #d32f2f)'}}
                        />
                        <path
                            d="M7 5.969L5.599 4.568a.29.29 0 0 0-.413.004l-.614.614a.294.294 0 0 0-.004.413L5.968 7l-1.4 1.401a.29.29 0 0 0 .004.413l.614.614c.113.114.3.117.413.004L7 8.032l1.401 1.4a.29.29 0 0 0 .413-.004l.614-.614a.294.294 0 0 0 .004-.413L8.032 7l1.4-1.401a.29.29 0 0 0-.004-.413l-.614-.614a.294.294 0 0 0-.413-.004L7 5.968z"
                            fill="#fff"
                        />
                    </g>
                </svg>
                <h2 className="text-lg">تایید ایمیل انجام نشد</h2>
                <p className="text-sm text-primary-red">
                    {error instanceof ApiError ? error.message : "خطایی رخ داد. لطفا دوباره تلاش کنید"}
                </p>
                <Link to="/auth"
                      className="bg-primary-blue px-4 py-3 rounded-sm w-full text-white cursor-pointer active:bg-dark-gray mt-2">بازگشت
                    به صفحه ورود</Link>
            </div>
        )
    }

    return (
        <></>
    );
}

export default VerifyEmailPage;