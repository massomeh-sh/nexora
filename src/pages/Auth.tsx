import type {JSX} from 'react';
import {Outlet} from "react-router";


function Auth(): JSX.Element {
    return (
        <section className="lg:flex lg:justify-center lg:items-center min-h-screen bg-white">
            <Outlet/>
        </section>
    );
}

export default Auth;