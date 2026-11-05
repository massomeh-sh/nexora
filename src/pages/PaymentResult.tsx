import {type JSX, useMemo} from 'react';
import {Link, Navigate, useLocation, useSearchParams} from "react-router";
import TicketCard from "@/UI/TicketCard.tsx";
import {FaCheck} from "react-icons/fa";
import {IoMdClose} from "react-icons/io";
import type {OrderData} from "@/types/order.ts";
import {priceFormater} from "@/utils/priceFormater.ts";
import {dateFormater} from "@/utils/dateFormater.ts";

function PaymentResultPage(): JSX.Element {
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const orderData: OrderData | undefined = location.state?.order;
    const formData = location.state?.formData;
    const status = searchParams.get("status");
    const isSuccess = status === "success";


    const orderDetails = useMemo(() => {
        if (!isSuccess || !orderData) return;
        return [
            {title: "شماره سفارش", value: orderData._id},
            {title: "مبلغ سفارش", value: `${priceFormater(orderData.totalPrice)} تومان `},
            {title: "تعداد کالا", value: `${orderData.items.length} کالا `},
            {title: "تاریخ ثبت سفارش", value: dateFormater(orderData.createdAt)}
        ]
    }, [orderData, isSuccess]);

    if (isSuccess && !orderDetails) return <Navigate to="/" replace/>;

    return (
        <TicketCard className="p-6 flex max-md:flex-col items-center justify-between" ticketHeader={
            <div className="flex flex-col p-6 items-center justify-center gap-10 w-full">
                <span
                    className={`text-white ring-12 p-4 rounded-full ${isSuccess ? " ring-green-300 bg-green-700" : "bg-primary-red ring-red-200"}`}>{isSuccess ?
                    <FaCheck size={30}/> : <IoMdClose size={30}/>}</span>
                <div className="w-full text-center">
                    <h1 className="text-2xl">{isSuccess ? "پرداخت با موفقیت انجام شد" : "پرداخت ناموفق بود"}</h1>
                    <p className="text-dark-gray mt-2">سفارش شما ثبت شد و به زودی برای ارسال آماده میشود.</p>
                    {!isSuccess &&
                        <div className="flex flex-col gap-4 items-center">
                            <p className="text-dark-gray mt-2 bg-gray-100 w-full max-w-lg rounded-lg p-2">اگر مبلغی از
                                حساب شما کسر شده باشد،
                                معمولا ظرف چند روز کاری به حساب تان برمیگردد.</p>
                            <Link to="/checkout" state={{formData}}
                                  className="block bg-primary-blue text-white p-2.5 rounded-lg w-full max-w-lg shadow-raised cursor-pointer mt-3">تلاش
                                مجدد برای پرداخت
                            </Link>
                            <Link to="/"
                                  className="block border border-light-gray p-2.5 rounded-lg w-full max-w-lg text-dark-gray shadow-raised cursor-pointer">بازگشت
                                به فروشگاه
                            </Link>
                        </div>
                    }
                </div>
            </div>
        }>
            {isSuccess && <div
                className="relative flex flex-col gap-3 w-full p-10 max-md:p-2 md:border-r max-md:border-t max-md:pt-5 border-dashed  border-light-gray">
                <ul className="flex flex-col gap-6 border-b pb-6 border-light-gray">
                    {orderDetails?.map((d) => (<li key={d.title} className="flex items-center justify-between">
                        <span className="text-dark-gray">{d.title}</span>
                        <span className="font-semibold">{d.value}</span>
                    </li>))}
                </ul>
                <Link to="/products"
                      className="block text-center mt-3 bg-primary-blue text-white rounded-lg p-2.5 cursor-pointer shadow-sm">ادامه
                    ی خرید
                </Link>
                <span
                    className="absolute md:-top-6 max-md:-top-3 max-md:left-0 md:right-3 bg-light-gray md:w-6 md:h-3 max-md:w-3 max-md:h-6 max-md:rounded-r-full md:rounded-b-full -mx-6"/>
                <span
                    className="absolute md:-bottom-6 max-md:-top-3 max-md:right-0 md:right-3 bg-light-gray md:w-6 md:h-3 max-md:w-3 max-md:h-6 max-md:rounded-l-full md:rounded-t-full -mx-6"/>
            </div>}
        </TicketCard>
    );
}

export default PaymentResultPage;