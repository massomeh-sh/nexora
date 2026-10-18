import {createBrowserRouter} from "react-router";
import LayoutPage from "../pages/Layout.tsx";
import HomePage from "../pages/Home.tsx";
import SignInPage from "../pages/auth/SignIn.tsx";
import SignUpPage from "../pages/auth/SignUp.tsx";
import ForgotPasswordPage from "../pages/auth/ForgotPassword.tsx";
import AuthLayoutPage from "../pages/auth/AuthLayout.tsx";
import CheckEmailPage from "../pages/auth/ChackEmail.tsx";
import VerifyEmailPage from "../pages/auth/VerifyEmail.tsx";
import ResetPasswordPage from "../pages/auth/ResetPassword.tsx";
import DashboardPage from "../pages/Dashboard.tsx";
import WishlistPage from "../pages/Wishlist.tsx";
import CartPage from "../pages/Cart.tsx";
import ProductPage from "../pages/Product.tsx";
import {productLoader} from "../loaders/productLoader.ts";
import {MutationCache, QueryClient} from "@tanstack/react-query";
import Loading from "../UI/Loading.tsx";
import SearchPage from "../pages/Search.tsx";
import {searchLoader} from "../loaders/searchLoader.ts";


export const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onSuccess: async (_data, _variables, _context, mutation) => {
            const key = mutation.options.mutationKey;
            await queryClient.invalidateQueries({
                queryKey: key,
            })
        }
    })
})

const router = createBrowserRouter([
    {
        element: <LayoutPage/>, children: [
            {path: "/", element: <HomePage/>},
            {
                path: "dashboard", element: <DashboardPage/>
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
                path: "search", element: <SearchPage/>,
                loader: searchLoader,
                hydrateFallbackElement: <Loading/>
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
    }
])


export default router;