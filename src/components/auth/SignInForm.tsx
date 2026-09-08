import {type JSX, useState} from 'react';
import nexoraLogo from "../../assets/img/nexora_logo_transparent.png";
import {Link} from "react-router";
import FormPasswordInput from "../../UI/FormPasswordInput.tsx";
import FormInput from "../../UI/FormInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import ForgotPassword from "./ForgotPassword.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {signInSchema} from "../../schema";


type SignInData = z.infer<typeof signInSchema>;

function SignInForm(): JSX.Element {
    const [forgotPassword, setForgotPassword] = useState(false);
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<SignInData>({
        resolver: zodResolver(signInSchema),
    });


    const onSubmit: SubmitHandler<SignInData> = (data) => {
        console.log(data);
    }

    const closeForgotForm = () => {
        setForgotPassword(false);
    }

    return (
        <div
            className="lg:border-2 lg:border-light-gray lg:rounded-lg flex max-lg:justify-center max-lg:items-center max-lg:min-h-screen flex-col lg:w-[500px] max-lg:w-full gap-4 px-8 max-lg:px-5 py-2 max-lg:py-0">
            <div className="relative flex items-center justify-center">
                <Link to="/" className="absolute right-0 max-lg:fixed max-lg:top-4 max-lg:right-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z"
                              fill="#000000"/>
                    </svg>
                </Link>
                <div className="flex items-center">
                    <img src={nexoraLogo} className="w-16 h-16" alt="لوگوی اصلی نکسورا"/>
                    <h2 className="text-3xl text-primxary-blue italic font-semibold">نکسورا</h2>
                </div>
            </div>

            {!forgotPassword && <>
                <div className="max-lg:w-full">
                    <h3 className="mt-5 text-lg">ورود به نکسورا</h3>
                    <p className="text-sm text-dark-gray">خوش آمدید! برای ورود به حساب کاربری خود، آدرس ایمیل و رمز عبور
                        را
                        وارد
                        کنید.</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-3 max-lg:w-full">
                    <FormInput type="email" id="email" autoComplete="email"
                               label="آدرس ایمیل" {...register("email")} error={errors.email?.message}/>
                    <FormPasswordInput label="رمز عبور" autoComplete="current-password"
                                       id="password" {...register("password")} error={errors.password?.message}/>
                    <div className="flex items-center justify-between">
                        <button onClick={() => setForgotPassword(true)} type="button"
                                className="text-sm text-primary-blue cursor-pointer">رمز عبور خود را
                            فراموش
                            کرده اید؟
                        </button>
                    </div>
                    <button disabled={isSubmitting}
                            className="w-full rounded-sm px-4 py-3 bg-primary-blue active:bg-dark-gray text-white cursor-pointer">ورود
                    </button>
                </form>
                <div className="flex gap-1 justify-center text-sm pb-2">
                    <p>حساب کاربری ندارید؟</p>
                    <Link to="signUp" className="text-primary-blue cursor-pointer">ثبت نام کنید.</Link>
                </div>
            </>
            }
            {forgotPassword && (
                <ForgotPassword handleCloseForm={closeForgotForm}/>
            )}
        </div>
    );
}

export default SignInForm;