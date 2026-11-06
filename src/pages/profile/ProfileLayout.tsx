import type {JSX} from 'react';
import {Outlet} from "react-router";

function ProfileLayoutPage(): JSX.Element {
    return (
        <section className="grid grid-cols-[30%_1fr] gap-6">
            <div className="bg-white p-6 rounded-lg">right</div>
            <div className="bg-white p-6 rounded-lg"><Outlet/></div>
        </section>
    );
}

export default ProfileLayoutPage;