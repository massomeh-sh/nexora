import type {JSX} from 'react';
import FormPasswordInput from "../../UI/form/FormPasswordInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {resetPasswordSchema} from "../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {resetPassword} from "../../api/auth.ts";
import {useNavigate, useParams} from "react-router";
import FormButton from "../../UI/form/FormButton.tsx";
import {ApiError} from "../../api/apiClient.ts";
import PasswordRequirements from "../../UI/form/PasswordRequirements.tsx";
import {useDispatch} from "react-redux";
import {setUser} from "../../store/user/userSlice.ts";
import useMergeGuestData from "../../hooks/useMergeGuestData.ts";

type ResetPasswordData = z.infer<typeof resetPasswordSchema>

function ResetPasswordPage(): JSX.Element {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {token} = useParams();
    const {register, handleSubmit, watch, formState: {errors}} = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema)
    })
    const {mergeGuestData} = useMergeGuestData();

    const {mutate, isPending, isError, error} = useMutation({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            dispatch(setUser(data.data));
            mergeGuestData();
            navigate("/dashboard");
        }
    })

    const onSubmit: SubmitHandler<ResetPasswordData> = (data) => {
        if (!token) return;
        mutate({password: data.password, token});
    }

    const password = watch("password")

    return (
        <div className="flex flex-col gap-5 max-lg:w-full">
            <div>
                <h2 className="text-lg">تنظیم رمز عبور جدید</h2>
                <p className="text-sm text-dark-gray">رمز عبور جدید خود را وارد کنید.</p>
                {isError && (
                    <p className="text-sm text-primary-red">{error instanceof ApiError ? error.message : "خطا در تغییر رمز عبور. لطفا مجددا تلاش کنید"}</p>)}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-lg:w-full pb-2">
                <div className="group">
                    <FormPasswordInput label="رمز عبور" id="password"
                                       autoComplete="currentPassword" {...register("password")}
                                       error={errors.password?.message}/>
                    <div className="hidden group-focus-within:block">
                        {!errors.password && <PasswordRequirements password={password ?? ""}/>}
                    </div>
                </div>
                <FormPasswordInput label="تکرار رمز عبور"
                                   id="confirm-password"
                                   autoComplete="currentPassword" {...register("confirmPassword")}
                                   error={errors.confirmPassword?.message}/>
                <FormButton isSubmitting={isPending} btnText="ثبت رمز عبور جدید"/>
            </form>
        </div>
    );
}

export default ResetPasswordPage;