import {useState} from 'react';
import BreadCrumbs from "@/UI/BreadCrumbs.tsx";
import type {BreadCrumbsItem} from "@/types/breadCrumbsItem.ts";
import {useAppSelector} from "@/hooks/useAppSelector.ts";
import {clearLocalCart, selectCartPricing} from "@/store/cart/cartSlice.ts";
import {priceFormater} from "@/utils/priceFormater.ts";
import {IoIosArrowUp} from "react-icons/io";
import {IoIosArrowDown} from "react-icons/io";
import CheckoutProductCart from "@/components/order/CheckoutProductCart.tsx";
import {HiOutlineExclamationCircle} from "react-icons/hi2";
import FormInput from "@/UI/form/FormInput.tsx";
import AddressSelects from "@/components/order/AddressSelects.tsx";
import {PAYMENT_METHODS} from "@/constants/paymentMethods.ts";
import {FREE_SHIPPING_THRESHOLD, SHIPPING_COST} from "@/constants/freeShipping.ts";
import {Link, useLocation, useNavigate} from "react-router";
import EmptyCheckout from "@/components/order/EmptyCheckout.tsx";
import {type SubmitHandler, useForm, useWatch} from "react-hook-form";
import DotsSpinner from "@/UI/DotsSpinner.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {createOrderSchema} from "@/schema";
import {z} from "zod";
import {useMutation} from "@tanstack/react-query";
import {createOrder} from "@/api/order.ts";
import {ApiError} from "@/api/apiClient.ts";
import {useDispatch} from "react-redux";
import {useClearCart} from "@/hooks/useClearCart.ts";
import TicketCard from "@/UI/TicketCard.tsx";
import {toast} from "sonner";


export type FormFields = z.infer<typeof createOrderSchema>;

function CheckoutPage() {
    const location = useLocation();
    const [showDetails, setShowDetails] = useState(false);
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const cart = useAppSelector(state => state.cart);
    const {subTotal, shipping, freeShipping} = useAppSelector(selectCartPricing);
    const userData = useAppSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {mutateAsync} = useMutation({
        mutationFn: createOrder,
    });

    const {mutate: mutateClearCart} = useClearCart();

    const userCart = isAuthenticated ? cart?.cart?.items : cart.localItems;

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: {errors, isSubmitting}
    } = useForm<FormFields>({
        defaultValues: {
            name: userData.name ?? "",
            phone: userData.phone ?? "",
            paymentMethod: "zarinpal",
            ...(location.state?.formData ?? {})
        },
        resolver: zodResolver(createOrderSchema),
    });

    const paymentMethod = useWatch({control, name: "paymentMethod"});
    const current = PAYMENT_METHODS.find(m => (m.value === paymentMethod)) ?? PAYMENT_METHODS[0]

    const items: BreadCrumbsItem[] = [
        {label: "خانه", to: '/'},
        {
            label: "سبد خرید", to: "/cart"
        }, {
            label: "ثبت سفارش"
        }];


    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const payload = {
            shippingAddress: {
                fullName: data.name,
                receiverPhone: data.phone,
                province: data.province,
                city: data.city,
                postalCode: data.postCode,
                address: data.address,
            },
            paymentMethod: data.paymentMethod,
            note: data.notes
        }
        try {
            const res = await mutateAsync(payload);
            const order = res.data;
            navigate(`/payment/result?status=success&orderId=${order._id}`, {replace: true, state: {order}});
            if (isAuthenticated) {
                mutateClearCart();
            } else {
                dispatch(clearLocalCart());
            }
        } catch (error) {
            const message = error instanceof ApiError ? error.message : "خطایی رخ داد";
            toast.error(message);
            navigate("/payment/result?status=failed", {replace: true, state: {formData: data}});
        }
    }

    if (!userCart) return null;

    if (userCart?.length === 0) return (
        <EmptyCheckout/>
    )

    return (
        <div className="h-full flex flex-col gap-6 max-md:gap-3 max-md:-my-8">
            <BreadCrumbs items={items} className="-mb-5"/>

            <TicketCard>

                <div onClick={() => setShowDetails((pre) => !pre)}
                     className="flex items-center justify-between cursor-pointer p-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-[20px] max-md:text-lg">جزعیات محصولات</h2>
                        <span className="text-sm text-dark-gray">({userCart.length} کالا)</span>
                    </div>

                    <button aria-label={`${showDetails ? " بستن جزعیات پرداخت" : "نمایش جزعیات پرداخت"}`}
                            className="text-dark-gray pointer-events-none">
                        {showDetails ? <IoIosArrowUp size={20}/> : <IoIosArrowDown size={20}/>}
                    </button>
                </div>

                <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out overflow-hidden ${showDetails ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="min-h-0 overflow-hidden">

                        <div className="flex flex-col p-6">
                            <ul className="relative flex flex-col gap-5 border-b border-dashed border-light-gray pb-5">
                                {userCart.map((item) => {
                                    return (
                                        <CheckoutProductCart key={`${item.product._id}_${item.product.name}`}
                                                             product={item.product}
                                                             productQuantity={item.quantity}
                                                             variantId={item.variantId}/>
                                    )
                                })}
                                <span
                                    className="absolute left-0 -bottom-2.5 bg-light-gray w-3 h-6 rounded-r-full -mx-6"/>
                                <span
                                    className="absolute right-0 -bottom-2.5 bg-light-gray w-3 h-6 rounded-l-full -mx-6"/>
                            </ul>


                            <div className="flex items-center justify-between mt-8 max-md:text-[16px]">
                                <p className="text-dark-gray space-x-1">
                                    <span>مجموع قیمت کالاها</span>
                                    <span>({userCart.length} کالا)</span>
                                </p>
                                <p className="space-x-1">
                                    <span className="text-lg">{priceFormater(subTotal)}</span>
                                    <span className="text-dark-gray text-sm">تومان</span>
                                </p>
                            </div>

                            <p className="flex items-center justify-between text-dark-gray mt-1">
                                <span>هزینه ارسال</span>
                                {freeShipping ? <span className="text-green-500 max-md:text-sm">رایگان</span> :
                                    <span>{`${priceFormater(shipping)} تومان `}</span>}
                            </p>
                            {!freeShipping && (<span
                                className="bg-green-200 rounded-lg p-4 text-sm mt-2">{`${priceFormater(FREE_SHIPPING_THRESHOLD - subTotal)} تومان دیگر خرید کنید تا از ارسال رایگان بهره مند شوید! `}</span>)}
                            <div className="flex items-center justify-between text-lg font-semibold my-10">
                                <p>مبلغ قابل پرداخت</p>
                                <p className="space-x-1">
                                    <span>{priceFormater(freeShipping ? subTotal : subTotal + shipping)}</span>
                                    <span className="text-sm">تومان</span>
                                </p>
                            </div>


                            <p className="text-gray-400 text-sm flex items-start gap-1 max-md:text-sm">
                                <HiOutlineExclamationCircle size={25}/>
                                <span>مبلغ سفارش هنوز پرداخت نشده و‌ در صورت اتمام موجودی، کالاها از سبد حذف می‌شوند.</span>
                            </p>

                        </div>
                    </div>
                </div>
            </TicketCard>


            < div
                className="bg-white p-6 rounded-lg shadow-sm">
                <h2
                    className="text-[20px] max-md:text-lg"> اطلاعات
                    گیرنده
                    و
                    آدرس </h2>
                <p className="text-sm max-md:text-[12px] text-dark-gray">سفارش به این آدرس ارسال میشود</p>

                <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}
                      className="grid grid-cols-2 max-md:grid-cols-1 gap-x-5 gap-y-8 mt-6">
                    <FormInput {...register("name")} error={errors?.name?.message} id="name"
                               label="نام و نام خانوادگی"
                               autoComplete="name"
                               placeholder="مثلا سارا رحیمی"/>

                    <FormInput {...register("phone")} error={errors?.phone?.message} dir="ltr" id="phone"
                               label="شماره موبایل"
                               autoComplete="tel"
                               placeholder="091988*****"/>

                    <AddressSelects register={register} control={control} errors={errors} setValue={setValue}/>

                    <FormInput {...register("postCode")} error={errors?.postCode?.message} id="postCode"
                               label="کد پستی"
                               className="col-span-2 max-md:col-span-1"
                               autoComplete="postal-code" placeholder="کد 9 یا 10 رقمی، مثل 1234567891"/>
                    <FormInput {...register("address")} error={errors?.address?.message} id="address"
                               label="آدرس کامل"
                               placeholder="خیابان، کوچه، پلاک و واحد"
                               autoComplete="street-address" className="col-span-2 max-md:col-span-1"/>

                    <div
                        className="flex flex-col gap-2 col-span-2 max-md:col-span-1 max-md:text-sm">
                        <label>توضیحات سفارش (اختیاری)</label>
                        <textarea {...register("notes")} maxLength={100} rows={3}
                                  placeholder="قبل از خرید تماس بگیرید.."
                                  className="px-3 py-4 focus:ring-3 max-md:placeholder:text-[12px] focus:ring-primary-blue/70 outline-none caret-primary-blue border border-gray-300 focus:bg-light-gray rounded-lg resize-none focus:border-primary-blue"/>
                    </div>
                </form>

            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-[20px] max-md:text-lg">روش پرداخت</h2>
                <p className="text-sm max-md:text-[12px] text-dark-gray">یکی از روش های زیر را انتخاب کنید</p>

                <div role="radiogroup" className="space-y-5 mt-8">
                    {PAYMENT_METHODS.map((method) => {
                        const Icon = method.icon;
                        const selected = current.value === method.value;

                        return (
                            <label key={method.value}
                                   className={`flex items-center gap-4 border py-5 px-2 rounded-lg cursor-pointer ${selected ? "border-primary-blue ring-2 ring-primary-blue/70" : "border-gray-300"}`}>
                                <input form="checkout-form" {...register("paymentMethod")} type="radio"
                                       value={method.value}/>
                                <span
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                        selected ? "bg-light-gray text-primary-blue" : "bg-light-gray text-gray-500"
                                    }`}>
                                    <Icon className="w-15"/>
                                </span>
                                <span className="flex-1">
                                    <span
                                        className="block text-[15px] max-md:text-[13px] font-medium">{method.title}</span>
                                    <span
                                        className="mt-0.5 block text-[13px] max-md:text-[12px] text-gray-500">{method.desc}</span>
                                </span>
                            </label>
                        )
                    })}
                </div>
            </div>


            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-[20px]">خلاصه سفارش</h2>
                <div className="grid grid-cols-2 gap-2 mt-5 text-dark-gray border-b border-light-gray pb-4">
                    <p className="space-x-1"><span>جمع کالاها</span><span>{`(${userCart.length} عدد)`}</span></p>
                    <span className="justify-self-end">{priceFormater(subTotal)} تومان </span>
                    <span>هزینه ارسال</span>
                    <p className="justify-self-end">
                        {freeShipping ? <span className="text-green-500">رایگان</span> :
                            <span>{`${priceFormater(shipping)} تومان `}</span>}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-4 text-lg font-semibold">
                    <p>مبلغ قابل پرداخت</p>
                    <span>{priceFormater(freeShipping ? subTotal : subTotal + SHIPPING_COST)} تومان </span>
                </div>

                <button form="checkout-form" disabled={isSubmitting} type="submit"
                        className="active:scale-99 active:opacity-80 transition-transform duration-300 text-center w-full flex items-center justify-center mt-4 text-white rounded-lg p-3 cursor-pointer bg-primary-blue max-md:text-sm">
                    {isSubmitting ? <DotsSpinner/> : "ثبت سفارش و پرداخت"}
                </button>
                <div className="block text-sm justify-self-center mt-2 text-dark-gray">با ثبت سفارش، <Link
                    className="text-primary-blue"
                    to="/nexora-rules">قوانین
                    و مقررات نکسورا</Link> را می‌پذیرید.
                </div>
            </div>

        </div>
    )
        ;
}

export default CheckoutPage;