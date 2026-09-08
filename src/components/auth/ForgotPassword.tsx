import type {JSX} from 'react';
import FormInput from "../../UI/FormInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {forgotPasswordSchema} from "../../schema";

interface ForgotPasswordProps {
    // Props here
    handleCloseForm: () => void;
}


type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

function ForgotPassword({handleCloseForm}: ForgotPasswordProps): JSX.Element {
    const {register, handleSubmit, formState: {isSubmitting, errors}} = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const onSubmit: SubmitHandler<ForgotPasswordData> = (data) => {
        console.log(data);
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
            <FormInput id="email" type="email" label="آدرس ایمیل"
                       autoComplete="email" {...register("email")} error={errors.email?.message}/>
            <button className="bg-primary-blue w-full active:bg-dark-gray
                     text-white px-4 py-3 rounded-sm cursor-pointer">ارسال
            </button>
            <button disabled={isSubmitting} onClick={handleCloseForm} className="text-primary-blue cursor-pointer pb-2"
                    type="button">
                بازگشت
            </button>
        </form>
    );
}

export default ForgotPassword;