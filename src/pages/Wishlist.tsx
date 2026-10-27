import type {JSX} from 'react';
import {useAppSelector} from "../hooks/useAppSelector.ts";
import WishlistPageCard from "../components/wishlist/WishlistPageCard.tsx";
import EmptyCartAndWishlist from "../UI/EmptyCartAndWishlist.tsx";
import emptyWishlistImage from "../assets/icons/empty-wishlist-clipboard.svg"
import BreadCrumbs from "@/UI/BreadCrumbs.tsx";
import type {BreadCrumbsItem} from "@/types/breadCrumbsItem.ts";

function WishlistPage(): JSX.Element {
    const items = useAppSelector(state => state.wishlist.items);

    const breadCrumbsItems: BreadCrumbsItem[] = [
        {label: "خانه", to: "/"},
        {label: "علاقه مندی"}
    ]


    return (
        <section>
            <BreadCrumbs items={breadCrumbsItems}/>
            {items.length === 0 ? (
                    <EmptyCartAndWishlist description="لیست علاقه مندی های شما خالی است." image={emptyWishlistImage}
                                          title="هیچ علاقه مندی ندارید"/>) :
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {items.map((item) => <li key={item._id}><WishlistPageCard product={item}/></li>)}
                </ul>}
        </section>
    );
}

export default WishlistPage;