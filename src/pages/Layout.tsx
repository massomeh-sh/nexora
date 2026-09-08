import type {JSX} from 'react';
import {Outlet} from "react-router";
import Header from "../components/Header.tsx";
import MobileNavigation from "../components/MobileNavigation.tsx";

function LayoutPage(): JSX.Element {
    return (
        <>
            <Header/>
            <MobileNavigation/>
            <main>
                <Outlet/>
            </main>
        </>
    );
}

export default LayoutPage;