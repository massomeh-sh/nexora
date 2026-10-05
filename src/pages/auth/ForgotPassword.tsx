import type {JSX} from 'react';
import FormInput from "../../UI/form/FormInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {forgotPasswordSchema} from "../../schema";
import {Link, useLocation} from "react-router";
import FormButton from "../../UI/form/FormButton.tsx";
import {useMutation} from "@tanstack/react-query";
import {forgotPassword} from "../../api/auth.ts";
import {ApiError} from "../../api/apiClient.ts";


type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordPage(): JSX.Element {
    const location = useLocation();
    const {email} = location.state ?? {};
    const {register, handleSubmit, formState: {errors}} = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {email}
    });

    const {mutate, data, isError, error, isSuccess, isPending} = useMutation({
        mutationFn: forgotPassword,
    })

    const onSubmit: SubmitHandler<ForgotPasswordData> = (data) => {
        mutate(data.email);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-lg:w-full">
            <div>
                <h2 className="text-lg">رمز عبور خود را فراموش کرده‌اید؟</h2>
                <p className="text-sm text-dark-gray">نگران نباشید! آدرس ایمیل خود را وارد کنید تا لینک بازیابی
                    رمز
                    عبور
                    برای شما ارسال شود.</p>
            </div>
            {isSuccess && <p className="text-sm text-green-600">{data?.message}</p>}
            {isError && (
                <p className="text-sm text-primary-red">{error instanceof ApiError ? error.message : "خطا در ارسال ایمیل."}</p>)}
            <FormInput id="email" type="email" label="آدرس ایمیل"
                       autoComplete="email" {...register("email")} error={errors.email?.message}/>
            <FormButton isSubmitting={isPending} btnText="ارسال"/>
            <Link to=".." className="text-primary-blue cursor-pointer pb-2"
                  type="button">
                بازگشت
            </Link>
        </form>
    );
}

export default ForgotPasswordPage;