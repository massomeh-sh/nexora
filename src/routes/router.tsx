import {createBrowserRouter} from "react-router";
import LayoutPage from "../pages/Layout.tsx";
import HomePage from "../pages/Home.tsx";
import Auth from "../pages/Auth.tsx";
import SignInForm from "../components/auth/SignInForm.tsx";
import SignUpForm from "../components/auth/SignUpForm.tsx";

const router = createBrowserRouter([
    {
        element: <LayoutPage/>, children: [
            {path: "/", element: <HomePage/>}
        ]
    },
    {
        element: <Auth/>, path: "/auth", children: [
            {index: true, element: <SignInForm/>},
            {path: "signUp", element: <SignUpForm/>}
        ]
    }
])


export default router;