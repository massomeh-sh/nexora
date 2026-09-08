import {type JSX} from 'react';
import nexoraLogo from "../../assets/img/nexora_logo_transparent.png";
import {Link} from "react-router";
import FormInput from "../../UI/FormInput.tsx";
import FormPasswordInput from "../../UI/FormPasswordInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import SubmitLoader from "../../UI/SubmitLoader.tsx";
import {signupSchema} from "../../schema";


type SignUpData = z.infer<typeof signupSchema>;

function SignUpForm(): JSX.Element {

    const {register, handleSubmit, formState: {isSubmitting, errors}} = useForm<SignUpData>({
        resolver: zodResolver(signupSchema)
    });

    const onSubmit: SubmitHandler<SignUpData> = (data) => {
        console.log(data);
    }

    return (
        <div
            className="lg:border-2 lg:border-light-gray lg:rounded-lg flex flex-col max-lg:justify-center max-lg:items-center max-lg:min-h-screen lg:w-[500px] max-lg:w-full gap-4 px-8 max-lg:px-5 py-2 max-lg:py-0">
            <div className="relative flex items-center justify-center">
                <Link to="/" className="absolute right-0  max-lg:fixed max-lg:top-4 max-lg:right-5">
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
            <div className="w-full">
                <h2 className="mt-5 text-lg">ایجاد حساب کاربری جدید</h2>
                <p className="text-sm text-dark-gray">به نکسورا خوش آمدید.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-lg:w-full">
                <FormInput id="full-name" label="نام و نام خانوادگی" {...register("name")} autoComplete="name"
                           error={errors.name?.message}/>
                <FormInput id="email" type="email" label="آدرس ایمیل" autoComplete="email" {...register("email")}
                           error={errors.email?.message}/>
                <FormInput id="phone-number" type="tel" label="شماره تلفن" autoComplete="tel" {...register("phone")}
                           error={errors.phone?.message}/>
                <FormPasswordInput label="رمز عبور" {...register("password")} autoComplete="new-password" id="password"
                                   error={errors.password?.message}/>
                <FormPasswordInput label="تکرار رمز عبور" {...register("confirmPassword")} autoComplete="new-password"
                                   id="confirm-password" error={errors.confirmPassword?.message}/>
                <div className="flex items-center justify-between text-sm">
                    <label htmlFor="aggriment">با شرایط استفاده و حریم خصوصی موافقم</label>
                    <input type="checkbox" id="aggriment" name="aggriment"/>
                </div>
                <SubmitLoader isSubmitting={isSubmitting} btnText="ثبت نام"/>
                <div className="flex items-center justify-center text-sm gap-1 pb-2">
                    <p>حساب کاربری دارید؟</p>
                    <Link to="/auth" className="text-primary-blue">وارد شوید.</Link>
                </div>
            </form>
        </div>
    );
}

export default SignUpForm;