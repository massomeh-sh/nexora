import {useAppSelector} from "../../hooks/useAppSelector.ts";
import {selectedCartSubTotal} from "../../store/cart/cartSlice.ts";
import {priceFormater} from "@/utils/priceFormater.ts";
import {Link, useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import {hideCartSidebar} from "../../store/ui/uiSlice.ts";

const FREESHIPPINGTHRESHOLD = 1000000;

function CartSidebarSummary() {
    const subTotal = useAppSelector(selectedCartSubTotal) ?? 0;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isEmpty = !subTotal;

    const progress = Math.min((subTotal / FREESHIPPINGTHRESHOLD) * 100, 100);

    const remaining = FREESHIPPINGTHRESHOLD - subTotal;


    const handleNavigateToCart = () => {
        navigate("/cart");
        dispatch(hideCartSidebar());
    }

    return (
        <div className="bg-lightest-gray px-5 lg:px-8 py-5 shrink-0 border-t border-light-gray mt-auto space-y-3">
            {remaining > 0 &&
                <p className="text-darkest-gray">{priceFormater(remaining)} تومان دیگر خرید کنید تا از <span
                    className="font-bold">ارسال رایگان</span> بهره مند شوید!</p>}
            {remaining <= 0 && (
                <p>ارسال خرید شما کاملا رایگان است !</p>
            )}
            <div className="relative mt-3 h-2 max-2xl:ml-3 rounded-full bg-light-gray">
                <div style={{width: `${progress}%`}}
                     className="absolute right-0 top-0 h-full rounded-full progress transition-all duration-500"></div>
                <div style={{right: `${progress - 8}%`}}
                     className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-7 w-7 max-sm:w-6 max-sm:h-6 items-center justify-center rounded-full bg-primary-blue transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#FFFF" width="1em" height="1em"
                         viewBox="-3 0 32 32" version="1.1">
                        <title>truck</title>
                        <path
                            d="M23.64 6.64h-13c-1.4 0-2.56 1.16-2.56 2.56v0.64h-1.32c-1.040 0-2.040 0.48-2.68 1.32l-2.56 3.32c-0.12 0.16-0.16 0.32-0.16 0.52v5.84h-0.48c-0.44 0-0.84 0.32-0.88 0.76-0.040 0.52 0.36 0.92 0.84 0.92h3.32c0.4 1.64 1.84 2.84 3.6 2.84s3.2-1.2 3.6-2.84h4.84c0.4 1.64 1.84 2.84 3.6 2.84s3.2-1.2 3.6-2.84h2c0.48 0 0.84-0.4 0.84-0.84v-12.48c-0.040-1.44-1.2-2.56-2.6-2.56zM5.44 12.2c0.32-0.4 0.8-0.64 1.32-0.64h1.32v2.56h-4.12l1.48-1.92zM7.76 23.68c-1.080 0-2-0.88-2-2s0.88-2 2-2 2 0.88 2 2-0.92 2-2 2zM19.76 23.68c-1.080 0-2-0.88-2-2s0.88-2 2-2 2 0.88 2 2-0.92 2-2 2zM24.48 20.84h-1.12c-0.4-1.64-1.84-2.84-3.6-2.84s-3.2 1.2-3.6 2.84h-4.8c-0.4-1.64-1.84-2.84-3.6-2.84s-3.2 1.2-3.6 2.84h-1.080v-5.040h5.84c0.48 0 0.84-0.4 0.84-0.84v-5.76c0-0.48 0.36-0.84 0.84-0.84h13c0.48 0 0.84 0.36 0.84 0.84v11.64z"/>
                    </svg>
                </div>
            </div>
            <div className="mt-2 space-y-2">
                <p className="flex justify-between items-center text-[19px] max-md:text-[16px]">
                    <span>جمع خرید</span><span>{priceFormater(subTotal)} تومان </span></p>
                <p className="text-sm max-md:text-xs">هزینه ارسال و مالیات در مرحله پرداخت محاسیه خواهند شد.</p>
            </div>
            <div className="flex gap-2 justify-between max-sm:text-xs max-sm:flex-col">
                <Link to="/checkout"
                      aria-disabled={isEmpty}
                      onClick={(e) => {
                          if (isEmpty) e.preventDefault();
                      }}
                      className="w-full block bg-darkest-gray p-2 text-white text-center hover:opacity-90 rounded-lg">ثبت
                    سفارش
                </Link>
                <button onClick={handleNavigateToCart}
                        className="w-full block cursor-pointer p-2 text-center border border-darkest-gray text-darkest-gray hover:bg-darkest-gray hover:text-white transition-colors duration-300 rounded-lg">مشاهده
                    سبد خرید
                </button>
            </div>
        </div>
    );
}

export default CartSidebarSummary;