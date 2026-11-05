import type {JSX} from 'react';
import {Link} from "react-router";
import {PiShoppingCart} from "react-icons/pi";

function EmptyCheckout(): JSX.Element {
    return (
        <div className="bg-white px-6 py-12 rounded-lg flex flex-col items-center justify-center ">
            <span className="bg-primary-blue text-white p-5 rounded-full"><PiShoppingCart size={30}/></span>
            <h1 className="text-lg mt-5">سبد خرید شما خالی است</h1>
            <p className="text-sm text-dark-gray">برای ثبت سفارش، ابتدا چند کالا به سبد خرید اضافه کنید.</p>
            <Link to="/products" aria-label="مشاهده همه محصولات"
                  className="mt-5 bg-primary-blue text-center text-white px-6 py-2 w-sm rounded-lg active:scale-99 active:opacity-80 cursor-pointer">مشاهده
                محصولات
            </Link>
            <Link to="/" className="text-sm text-dark-gray mt-2">بازگشت به خانه</Link>
        </div>
    );
}

export default EmptyCheckout;