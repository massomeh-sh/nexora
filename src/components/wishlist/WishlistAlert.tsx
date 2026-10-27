import {useAppSelector} from "../../hooks/useAppSelector.ts";
import {useCallback, useEffect, useMemo, useRef} from "react";
import {hideProductAlert} from "../../store/ui/uiSlice.ts";
import {addLocalToWishlist, removeLocalFromWishlist, setWishlist} from "../../store/wishlist/wishlistSlice.ts";
import {useMutation} from "@tanstack/react-query";
import {addItemToWishlist} from "../../api/wishlist.ts";
import useRemoveItemFromWishlist from "../../hooks/useRemoveItemFromWishlist.ts";
import useAddToCart from "../../hooks/useAddToCart.ts";
import {addLocalItem, makeSelectIsInCart} from "../../store/cart/cartSlice.ts";
import {useNavigate} from "react-router";
import {ApiError} from "../../api/apiClient.ts";
import {toast} from "sonner";
import {useDispatch} from "react-redux";

function WishlistAlert() {
    const wishlistAlert = useAppSelector(state => state.ui.productAlert);
    const selectedProduct = useAppSelector(state => state.ui.selectedProduct)
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const navigate = useNavigate();
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    const variantId = wishlistAlert?.variantId;
    const productId = wishlistAlert?.productId;

    const selectIsInCart = useMemo(() => makeSelectIsInCart(), []);
    const isInCart = useAppSelector(state => selectIsInCart(state, productId ?? "", wishlistAlert?.variantId)
        )
    ;

    const {mutate} = useAddToCart();

    const {mutate: addItem} = useMutation({
        mutationFn: addItemToWishlist,
        onSuccess: (data) => {
            dispatch(setWishlist(data.data.products));
        },
        onError: (error) => {
            const err = error instanceof ApiError ? error.message : "خطا در اضافه کردن محصول به علاقه مندی";
            toast.error(err)
        }
    });

    const {mutate: removeItem} = useRemoveItemFromWishlist();

    const startTimer = useCallback(() => {
        timerRef.current = setTimeout(() => {
            dispatch(hideProductAlert());
        }, 5000)
    }, [dispatch, timerRef])

    useEffect(() => {
        if (!wishlistAlert) return;

        startTimer();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [dispatch, wishlistAlert, startTimer]);

    const handleMouseEnter = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    }

    const handleMouseLeave = () => {
        startTimer();
    }

    const handleClickWishlistBtn = () => {
        if (!wishlistAlert) return;
        if (wishlistAlert.type === "add" && !isAuthenticated) {
            dispatch(removeLocalFromWishlist(wishlistAlert.productId))
            dispatch(hideProductAlert());
        } else if (wishlistAlert.type === "add" && isAuthenticated) {
            removeItem(wishlistAlert.productId);
            dispatch(hideProductAlert());
        } else if (wishlistAlert.type === "remove" && !isAuthenticated) {
            dispatch(addLocalToWishlist(selectedProduct));
            dispatch(hideProductAlert());
        } else if (wishlistAlert.type === "remove" && isAuthenticated) {
            addItem(wishlistAlert.productId);
            dispatch(hideProductAlert());
        }
    }

    const handleAddToCart = () => {

        if (!selectedProduct) return;
        if (isInCart) return navigate("/cart");

        if (isAuthenticated && !isInCart) {
            mutate({productId: selectedProduct._id, quantity: 1, variantId})
        } else if (!isAuthenticated && !isInCart) {
            dispatch(addLocalItem({product: selectedProduct, quantity: 1, variantId}))
        }
    }

    if (!wishlistAlert) return null;

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`fixed top-3 right-3 z-100 overflow-hidden bg-gray-50 text-sm lg:text-lg pt-3 rounded-2xl max-md:w-[75%] md:w-[50%] lg:w-[40%] 2xl:w-[30%] ${wishlistAlert.type === "add" ? "border-2 border-green-600" : "border-2 border-primary-red"} flex flex-col gap-3 items-start`}>
            <h3 className={`line-clamp-2 font-medium px-5 text-[16px] lg:text-[20px] transition-colors duration-300 ${wishlistAlert.type === "add" ? "text-green-600" : "text-primary-red"}`}>{wishlistAlert.type === "add" ? "محصول با موفقیت به علاقه‌مندی‌ها اضافه شد" : "محصول با موفقیت از علاقه‌مندی‌ها حذف شد"}</h3>
            <div className="flex items-center justify-center gap-4 px-5">
                <img alt={wishlistAlert.productName}
                     src={`${import.meta.env.VITE_API_BASE_URL}${wishlistAlert.productImage}`}
                     className="w-10 h-10 lg:w-14 lg:h-14"/>
                <p>{wishlistAlert.productName}</p>
            </div>
            <div className="border-t border-light-gray w-full flex justify-center">
                <button onClick={handleClickWishlistBtn}
                        className={`py-3 cursor-pointer w-full transition-colors duration-300 ${wishlistAlert.type === "add" ? "text-primary-red bg-red-100 hover:bg-red-200" : "text-green-600 bg-green-100 hover:bg-green-200"}`}>{wishlistAlert.type === "add" ? "حذف از علاقه مندی ها" : "افزودن به علاقه مندی ها"}</button>
                <button onClick={handleAddToCart}
                        className="cursor-pointer w-full hover:bg-light-gray transition-colors duration-300">{isInCart ? "مشاهده سبد خرید" : "افزودن به سبد خرید"}</button>
            </div>
        </div>
    );
}

export default WishlistAlert;