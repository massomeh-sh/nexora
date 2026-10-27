import {type JSX, useEffect} from 'react';
import {Outlet, ScrollRestoration} from "react-router";
import Header from "../components/Header.tsx";
import MobileNavigation from "../components/MobileNavigation.tsx";
import WishlistAlert from "../components/wishlist/WishlistAlert.tsx";
import WishlistSidebar from "../components/wishlist/WishlistSidebar.tsx";
import {useQuery} from "@tanstack/react-query";
import {getMe} from "../api/auth.ts";
import {setUser} from "../store/user/userSlice.ts";
import {getWishlist} from "../api/wishlist.ts";
import {setWishlist} from "../store/wishlist/wishlistSlice.ts";
import {getCart} from "../api/cart.ts";
import {setCart} from "../store/cart/cartSlice.ts";
import CartSidebar from "../components/cart/CartSidebar.tsx";
import {useAppSelector} from "../hooks/useAppSelector.ts";
import QuickViewModal from "../components/quick-view/QuickViewModal.tsx";
import WishlistConfirmationModal from "../components/wishlist/WishlistConfirmationModal.tsx";
import CartConfirmationModal from "../components/cart/CartConfirmationModal.tsx";
import {toast} from "sonner";
import {ApiError} from "../api/apiClient.ts";
import TopLoadingBar from "../components/TopLoadingBar.tsx";
import ProductSharingModal from "@/components/product/ProductSharingModal.tsx";
import {useDispatch} from "react-redux";
import MenuSidebar from "../components/MenuSidebar.tsx";
import FilterBottomSheet from "@/components/product/FilterBottomSheet.tsx";

function LayoutPage(): JSX.Element {
    const dispatch = useDispatch();
    const selectedProduct = useAppSelector(state => state.ui.selectedProduct);
    const currentModal = useAppSelector(state => state.ui.currentModal);

    const {data: user} = useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        retry: false
    });

    const userId = user?.data?._id;

    const {data: wishlist, isError: wishlistIsError, error: wishlistError} = useQuery({
        queryKey: ["wishlist", {
            user: userId
        }],
        queryFn: getWishlist,
        enabled: !!userId,
    });

    const {data: serverCart, isError: cartIsError, error: cartError} = useQuery({
        queryKey: ["cart", {user: userId}],
        queryFn: getCart,
        enabled: !!userId,
    });

    useEffect(() => {
        if (user?.data) {
            dispatch(setUser(user.data));
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (wishlist?.data) {
            dispatch(setWishlist(wishlist.data.products));
        }
    }, [wishlist, dispatch]);


    useEffect(() => {
        if (serverCart?.data) {
            dispatch(setCart(serverCart?.data));
        }
    }, [serverCart, dispatch]);

    useEffect(() => {
        if (wishlistIsError) {
            const error = wishlistError instanceof ApiError ? wishlistError.message : "دریافت لیست علاقه‌مندی‌ها با خطا مواجه شد";
            toast.error(error);
        }

        if (cartIsError) {
            const error = cartError instanceof ApiError ? cartError.message : "دریافت سبد خرید با خطا مواجه شد";
            toast.error(error);
        }
    }, [cartError, cartIsError, wishlistError, wishlistIsError]);


    return (
        <>
            <ScrollRestoration getKey={(location) => location.pathname}/>
            <TopLoadingBar/>
            <Header/>
            <MobileNavigation/>
            <WishlistAlert/>
            <WishlistSidebar/>
            <CartSidebar/>
            <MenuSidebar/>
            <FilterBottomSheet/>
            <QuickViewModal key={selectedProduct?._id}/>
            <ProductSharingModal key={currentModal}/>
            <WishlistConfirmationModal/>
            <CartConfirmationModal/>
            <main className="px-36 py-8 max-lg:px-6">
                <Outlet/>
            </main>
        </>
    );
}

export default LayoutPage;