import {type JSX} from 'react';
import {Link, useLocation, useNavigate} from "react-router";
import FormPasswordInput from "../../UI/form/FormPasswordInput.tsx";
import FormInput from "../../UI/form/FormInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {signInSchema} from "../../schema";
import {useMutation} from "@tanstack/react-query";
import {signIn} from "../../api/auth.ts";
import {ApiError} from "../../api/apiClient.ts";
import FormButton from "../../UI/form/FormButton.tsx";
import {useDispatch} from "react-redux";
import {setUser} from "../../store/user/userSlice.ts";
import useMergeGuestData from "../../hooks/useMergeGuestData.ts";
import {toast} from "sonner";

type SignInData = z.infer<typeof signInSchema>;

function SignInPage(): JSX.Element {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register, handleSubmit, setError, getValues, formState: {errors}} = useForm<SignInData>({
        resolver: zodResolver(signInSchema),
    });

    const {mergeGuestData} = useMergeGuestData()
    const {resetSuccess} = location.state ?? {}

    const {mutateAsync, isPending} = useMutation({
        mutationFn: signIn,
        onError: (err) => {
            const error = err instanceof ApiError ? err.message : "ورود کاربر با خطا مواجه شد"
            toast.error(error)
        }
    })

    const onSubmit: SubmitHandler<SignInData> = async (data) => {
        try {
            const result = await mutateAsync({email: data.email, password: data.password});
            dispatch(setUser(result.data));
            mergeGuestData();

            navigate("/");
        } catch (error) {
            setError("root", {
                type: "server",
                message: error instanceof ApiError ? error.message : "خطایی رخ داد",
            })
        }
    }

    return (
        <>
            <div className="max-lg:w-full">
                <h2 className="mt-5 text-lg">ورود به نکسورا</h2>
                <p className="text-sm text-dark-gray">خوش آمدید! برای ورود به حساب کاربری خود، آدرس ایمیل و رمز عبور
                    را
                    وارد
                    کنید.</p>
                {resetSuccess &&
                    <p className="text-sm text-green-600">رمز عبور شما با موفقیت تغییر کرد. اکنون می‌توانید وارد
                        شوید.</p>}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-3 max-lg:w-full">
                {errors.root && (<p className="text-sm text-primary-red">{errors.root.message}</p>)}
                <FormInput type="email" id="email" autoComplete="email"
                           label="آدرس ایمیل" {...register("email")} error={errors.email?.message}/>
                <FormPasswordInput label="رمز عبور" autoComplete="current-password"
                                   id="password" {...register("password")} error={errors.password?.message}/>
                <div className="flex items-center justify-between">
                    <Link to="/auth/forgot-password" onClick={(e) => {
                        e.preventDefault();
                        navigate("/auth/forgot-password", {state: {email: getValues("email")}})
                        //We prevent the default way of Link and then only get the email input value when we click on this link not at the first initial render so it gets the latest value of the input.
                    }}
                          className="text-sm text-primary-blue cursor-pointer">رمز عبور خود را
                        فراموش
                        کرده اید؟
                    </Link>
                </div>
                <FormButton isSubmitting={isPending} btnText="ورود"/>
            </form>
            <div className="flex gap-1 justify-center text-sm pb-2">
                <p>حساب کاربری ندارید؟</p>
                <Link to="signUp" className="text-primary-blue cursor-pointer">ثبت نام کنید.</Link>
            </div>
        </>);
}

export default SignInPage;