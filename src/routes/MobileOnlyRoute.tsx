import type {JSX} from 'react';
import {useMediaQuery} from "react-responsive";
import {Navigate, Outlet} from "react-router";

function MobileOnlyRoute(): JSX.Element {
    const isMobile = useMediaQuery({maxWidth: 1024});
    if (!isMobile) {
        return <Navigate to="/"/>
    }

    return (
        <Outlet/>
    );
}

export default MobileOnlyRoute;