import useMergeCart from "./useMergeCart.ts";
import useMergeWishlist from "./useMergeWishlist.ts";

function useMergeGuestData() {
    const {mutate: mergeCart} = useMergeCart();
    const {mutate: mergeWishlist} = useMergeWishlist();

    const mergeGuestData = () => {
        const cartLocalStorage = JSON.parse(localStorage.getItem("cart") || "[]");
        const wishlistLocalStorage = JSON.parse(localStorage.getItem("wishlist") || "[]");

        if (wishlistLocalStorage.length > 0) {
            mergeWishlist(wishlistLocalStorage);
            localStorage.removeItem("wishlist")
        }

        if (cartLocalStorage.length > 0) {
            mergeCart(cartLocalStorage);
            localStorage.removeItem("cart");
        }
    }

    return {mergeGuestData}
}

export default useMergeGuestData;