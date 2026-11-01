import type {JSX} from 'react';
import BreadCrumbs from "@/UI/BreadCrumbs.tsx";
import type {BreadCrumbsItem} from "@/types/breadCrumbsItem.ts";

function CheckoutPage(): JSX.Element {
    const items: BreadCrumbsItem[] = [
        {label: "خانه", to: '/'},
        {
            label: "سبد خرید", to: "/cart"
        }, {
            label: "ثبت سفارش"
        }]


    return (
        <div className="h-full flex flex-col gap-8 max-md:-my-8">
            <BreadCrumbs items={items}/>
        </div>
    );
}

export default CheckoutPage;