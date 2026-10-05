import {type JSX} from 'react';
import {Link, useLocation, useNavigate} from "react-router";
import FormPasswordInput from "../../UI/form/FormPasswordInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import FormButton from "../../UI/form/FormButton.tsx";
import {signupSchema} from "../../schema";
import {useMutation} from "@tanstack/react-query";
import {signUp} from "../../api/auth.ts";
import {ApiError} from "../../api/apiClient.ts";
import FormInput from "../../UI/form/FormInput.tsx";
import PasswordRequirements from "../../UI/form/PasswordRequirements.tsx";
import {toast} from "sonner";


type SignUpData = z.infer<typeof signupSchema>;

function SignUpPage(): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();
    const {signUpData} = location.state ?? {};

    const {register, handleSubmit, watch, setError, formState: {errors}} = useForm<SignUpData>({
        resolver: zodResolver(signupSchema),
        defaultValues: signUpData
    });

    const {mutateAsync, isPending} = useMutation({
        mutationFn: signUp,
        onError: (err) => {
            const error = err instanceof ApiError ? err.message : "ثبت نام کاربر با خطا مواجه شد"
            toast.error(error)
        }
    })

    const onSubmit: SubmitHandler<SignUpData> = async (data) => {
        const {confirmPassword, agreement, ...signUpData} = data;
        try {
            const result = await mutateAsync(signUpData);

            navigate("/auth/check-email", {
                state: {
                    email: data.email, successMessage: result?.message, signUpData: {
                        name: data.name,
                        email: data.email,
                        phone: data.phone
                    }
                }
            })
        } catch (error) {

            if (error instanceof ApiError) {
                if (error.code === "REGISTER_EMAIL_FAILED") {
                    navigate("/auth/check-email", {
                        state: {
                            email: data.email, emailFailedInitially: true, signUpData: {
                                name: data.name,
                                email: data.email,
                                phone: data.phone
                            }
                        }
                    });
                    return;
                }
            }

            setError("root", {
                type: "server",
                message: error instanceof ApiError ? error.message : "خطایی رخ داد",
            })
        }
    }

    const password = watch("password");

    return (
        <>
            <div className="w-full">
                <h2 className="mt-5 text-lg">ایجاد حساب کاربری جدید</h2>
                <p className="text-sm text-dark-gray">به نکسورا خوش آمدید.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-lg:w-full">
                {errors.root && <p className="text-sm text-primary-red mt-1">{errors.root.message}</p>}
                <FormInput id="full-name" label="نام و نام خانوادگی" {...register("name")} autoComplete="name"
                           error={errors.name?.message}/>
                <FormInput id="email" type="email" label="آدرس ایمیل" autoComplete="email" {...register("email")}
                           error={errors.email?.message}/>
                <FormInput id="phone-number" type="tel" label="شماره تلفن" autoComplete="tel" {...register("phone")}
                           error={errors.phone?.message}/>
                <div className="group">
                    <FormPasswordInput label="رمز عبور" {...register("password")} autoComplete="new-password"
                                       id="password"
                                       error={errors.password?.message}/>
                    <div className="hidden group-focus-within:block">
                        {!errors.password && <PasswordRequirements password={password ?? ""}/>}
                    </div>
                </div>
                <FormPasswordInput label="تکرار رمز عبور" {...register("confirmPassword")} autoComplete="new-password"
                                   id="confirm-password" error={errors.confirmPassword?.message}/>
                <div className="flex flex-col">
                    <div className="flex items-center justify-between text-sm">
                        <label htmlFor="aggriment">با شرایط استفاده و حریم خصوصی موافقم</label>
                        <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                            <input type="checkbox" id="aggriment" {...register("agreement")}
                                   className="peer appearance-none w-5 h-5 border-2 border-primary-blue rounded-sm bg-white checked:bg-primary-blue/40 checked:border-0 focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-primary-blue/40"/>
                            <svg
                                className="pointer-events-none absolute w-3.5 h-3.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden text-white peer-checked:block"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor" version="1.1" id="Capa_1"
                                viewBox="0 0 335.765 335.765">
                                <g>
                                    <g>
                                        <polygon
                                            points="311.757,41.803 107.573,245.96 23.986,162.364 0,186.393 107.573,293.962 335.765,65.795   "/>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                    {errors.agreement && <p className="text-sm text-primary-red mt-1">{errors.agreement.message}</p>}
                </div>
                <FormButton isSubmitting={isPending} btnText="ثبت نام"/>
                <div className="flex items-center justify-center text-sm gap-1 pb-2">
                    <p>حساب کاربری دارید؟</p>
                    <Link to="/auth" className="text-primary-blue">وارد شوید.</Link>
                </div>
            </form>
        </>
    )
        ;
}

export default SignUpPage;