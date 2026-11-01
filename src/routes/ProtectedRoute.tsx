import type {JSX} from 'react';
import {useAppSelector} from "@/hooks/useAppSelector.ts";
import {Navigate, Outlet} from "react-router";

function ProtectedRoute(): JSX.Element {
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);

    if (!isAuthenticated) return (<Navigate to="/auth" replace/>);


    return (
        <Outlet/>
    );
}

export default ProtectedRoute;