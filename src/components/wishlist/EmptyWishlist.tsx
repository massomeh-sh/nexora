import type {JSX} from 'react';
import emptyWishListImg from "../../assets/icons/empty-wishlist-clipboard.svg";

function EmptyWishlist(): JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center">
            <img src={emptyWishListImg} alt="هیچ علاقه مندی ندارید" className="w-lg max-md:w-sm h-full select-none object-cover"/>
            <p></p>
        </div>
    );
}

export default EmptyWishlist;