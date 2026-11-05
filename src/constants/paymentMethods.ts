import {AiFillCreditCard} from "react-icons/ai";
import {FaTruck} from "react-icons/fa";
import type {PaymentMethod} from "@/types/order.ts";

export const PAYMENT_METHODS: PaymentMethod[] = [
    {
        title: "پرداخت آنلاین",
        value: "zarinpal",
        desc: "اتصال امن به درگاه زرین‌پال با کارت‌های شتاب",
        icon: AiFillCreditCard,
        submitLabel: "ثبت سفارش و پرداخت"
    },
    {
        title: "پرداخت در محل",
        value: "cash_on_delivery",
        desc: "هنگام تحویل سفارش به پیک پرداخت کنید",
        icon: FaTruck,
        submitLabel: "ثبت سفارش"
    }
]