import {type JSX, useEffect, useState} from 'react';
import FormButton from "../../UI/form/FormButton.tsx";
import {Link, useLocation} from "react-router";
import {useMutation} from "@tanstack/react-query";
import {resendVerification} from "../../api/auth.ts";
import {ApiError} from "../../api/apiClient.ts";

function CheckEmailPage(): JSX.Element {
    const [countDown, setCountDown] = useState<number>(0);

    const location = useLocation();
    const {email, emailFailedInitially, signUpData, successMessage} = location.state ?? {};
    const {mutate, isPending, data, isSuccess, isError, error} = useMutation({
        mutationFn: resendVerification,
        onSuccess: () => {
            setCountDown(60)
        }
    });

    useEffect(() => {
        if (countDown === 0) return;

        const timer = setInterval(() => {
            setCountDown((pre) => pre - 1)
        }, 1000);

        return () => {
            clearInterval(timer);
        }
    }, [countDown])

    const handleResendEmail = () => {
        if (!email) return;
        mutate(email);
    };

    const handleOpenEmail = () => {
        if (!email) return;

        const domain = email.split("@")[1]?.toLowerCase();

        if (domain === "gmail.com") {
            window.open("https://mail.google.com", "_blank");
        } else if (domain === "outlook.com" || domain === "hotmail.com") {
            window.open("https://outlook.com", "_blank");
        } else if (domain === "yahoo.com") {
            window.open("https://yahoo.com", "_blank");
        } else {
            window.open("https://mail.google.com", "_blank");
        }
    }

    return (
        <div className="flex flex-col gap-5 max-lg:w-full">
            <div>
                <h2 className="text-lg mt-5">ایمیل خود را بررسی کنید</h2>
                <p className="text-sm text-green-600">{successMessage}</p>
                {email && <p>{email}</p>}
                {emailFailedInitially && !isSuccess && !isError && (
                    <p className="text-sm text-primary-red">ارسال ایمیل تایید با خطا مواجه شد</p>)}
                {isError && (
                    <p className="text-sm text-primary-red">{error instanceof ApiError ? error.message : "خطایی رخ داد"}</p>)}
                {isSuccess && (<p className="text-sm text-dark-gray">{data?.message}</p>)}
            </div>
            <FormButton type="button" onClick={handleOpenEmail} isSubmitting={false} btnText="باز کردن ایمیل"/>
            <div className="text-center text-sm">
                <p className="text-dark-gray">ایمیلی دریافت نکردید؟</p>
                <button type="button" disabled={isPending || countDown > 0 || !email} onClick={handleResendEmail}
                        className="text-primary-blue cursor-pointer">{isPending ? "در حال ارسال مجدد لینک..." : countDown > 0 ? `ارسال مجدد لینک در ${countDown} ثانیه` : "ارسال مجدد لینک"}</button>
            </div>
            <div className="w-full h-0.5 bg-light-gray"/>
            <div className="flex flex-col text-sm text-dark-gray text-center pb-2">
                <p>آدرس اشتباه است؟</p>
                <Link to="/auth/signUp" state={{signUpData}} className="text-primary-blue">ویرایش ایمیل</Link>
            </div>
        </div>
    );
}

export default CheckEmailPage;