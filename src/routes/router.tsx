import {createBrowserRouter, Navigate} from "react-router";
import LayoutPage from "../pages/Layout.tsx";
import HomePage from "../pages/Home.tsx";
import SignInPage from "../pages/auth/SignIn.tsx";
import SignUpPage from "../pages/auth/SignUp.tsx";
import ForgotPasswordPage from "../pages/auth/ForgotPassword.tsx";
import AuthLayoutPage from "../pages/auth/AuthLayout.tsx";
import CheckEmailPage from "../pages/auth/ChackEmail.tsx";
import VerifyEmailPage from "../pages/auth/VerifyEmail.tsx";
import ResetPasswordPage from "../pages/auth/ResetPassword.tsx";
import ProfilePage from "../pages/profile/Profile.tsx";
import WishlistPage from "../pages/Wishlist.tsx";
import CartPage from "../pages/Cart.tsx";
import ProductPage from "../pages/Product.tsx";
import {productLoader} from "../loaders/productLoader.ts";
import {MutationCache, QueryClient} from "@tanstack/react-query";
import Loading from "../UI/Loading.tsx";
import ProductsPage from "../pages/Products.tsx";
import {searchLoader} from "../loaders/searchLoader.ts";
import MobileOnlyRoute from "@/routes/MobileOnlyRoute.tsx";
import CategoriesPage from "@/pages/Categories.tsx";
import CheckoutPage from "@/pages/Checkout.tsx";
// import OrdersPage from "@/pages/Orders.tsx";
// import OrderDetailsPage from "@/pages/OrderDetails.tsx";
import {checkoutLoader} from "@/loaders/checkoutLoader.ts";
import PaymentResultPage from "@/pages/PaymentResult.tsx";
import NotFoundPage from "@/pages/NotFound.tsx";
import OrdersPage from "@/pages/profile/Orders.tsx";
import ListsPage from "@/pages/profile/Lists.tsx";
import CommentsPage from "@/pages/profile/Comments.tsx";
import AddressesPage from "@/pages/profile/Addresses.tsx";
import NotificationPage from "@/pages/profile/Notification.tsx";
import UserHistoryPage from "@/pages/profile/UserHistory.tsx";
import PersonalPage from "@/pages/Personal.tsx";
import ProfileLayoutPage from "@/pages/profile/ProfileLayout.tsx";
import {profileLoader} from "@/loaders/profile/profileLoader.ts";


export const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onSuccess: async (_data, _variables, _context, mutation) => {
            const key = mutation.options.mutationKey;
            if (key) {
                await queryClient.invalidateQueries({
                    queryKey: key,
                })
            }
        }
    }), defaultOptions: {queries: {staleTime: 60 * 1000}}
})

const router = createBrowserRouter([
    {
        element: <LayoutPage/>, children: [
            {path: "/", element: <HomePage/>},
            {
                element: <MobileOnlyRoute/>, children: [
                    {path: "/categories", element: <CategoriesPage/>}
                ]
            },
            {
                path: "profile", element: <ProfileLayoutPage/>, loader: profileLoader, children: [
                    {index: true, element: <ProfilePage/>},
                    {path: "orders", element: <OrdersPage/>},
                    {path: "lists", element: <ListsPage/>},
                    {path: "comments", element: <CommentsPage/>},
                    {path: "addresses", element: <AddressesPage/>},
                    {path: "notifications", element: <NotificationPage/>},
                    {path: "user-history", element: <UserHistoryPage/>}
                ]
            },
            {
                path: "personal", element: <PersonalPage/>
            },
            {
                path: "wishlist", element: <WishlistPage/>
            },
            {
                path: "cart", element: <CartPage/>
            },
            {
                path: "product/:productName",
                element: <ProductPage/>,
                loader: productLoader,
                hydrateFallbackElement: <Loading/>,
            },
            {
                path: "products", element: <ProductsPage/>,
                loader: searchLoader,
            },
            {
                path: "checkout", element: <CheckoutPage/>, loader: checkoutLoader
            },
            {
                path: "payment", children: [
                    {index: true, element: <Navigate to="/checkout" replace/>},
                    {path: "result", element: <PaymentResultPage/>}
                ]
            }
        ]
    },
    {
        element: <AuthLayoutPage/>, path: "/auth", children: [
            {index: true, element: <SignInPage/>},
            {path: "signUp", element: <SignUpPage/>},
            {path: "check-email", element: <CheckEmailPage/>},
            {path: "verify-email/:token", element: <VerifyEmailPage/>},
            {path: "forgot-password", element: <ForgotPasswordPage/>},
            {path: "reset-password/:token", element: <ResetPasswordPage/>}
        ]
    },
    {path: "*", element: <NotFoundPage/>}
])


export default router;