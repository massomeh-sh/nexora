import type {JSX} from 'react';
import {useAppSelector} from "../hooks/useAppSelector.ts";
import WishlistPageCart from "../UI/product/WishlistPageCart.tsx";
import EmptyCartAndWishlist from "../UI/EmptyCartAndWishlist.tsx";
import emptyWishlistImage from "../assets/icons/empty-wishlist-clipboard.svg"

function WishlistPage(): JSX.Element {
    const items = useAppSelector(state => state.wishlist.items);

    return (
        <section>
            {items.length === 0 ? (
                    <EmptyCartAndWishlist description="لیست علاقه مندی های شما خالی است." image={emptyWishlistImage}
                                          title="هیچ علاقه مندی ندارید"/>) :
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {items.map((item) => <li key={item._id}><WishlistPageCart product={item}/></li>)}
                </ul>}
        </section>
    );
}

export default WishlistPage;