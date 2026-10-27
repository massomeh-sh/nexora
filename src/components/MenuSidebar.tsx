import type {JSX} from 'react';
import Sidebar from "../UI/Sidebar.tsx";
import {useAppSelector} from "../hooks/useAppSelector.ts";
import {hideMenuSidebar} from "../store/ui/uiSlice.ts";
import {useDispatch} from "react-redux";
import {TextAnimate} from "../../@/components/ui/text-animate.tsx";
import nexoraLogo from "../../public/nexoraFavicon.png";
import {menuLinks} from "@/constants/menuLinks.ts";
import {NavLink} from "react-router";
import LeftArrow from "../assets/icons/leftArrow.svg?react";


function MenuSidebar(): JSX.Element {
    const dispatch = useDispatch();
    const activeSidebar = useAppSelector(state => state.ui.activeSidebar);

    return (
        <Sidebar isOpen={activeSidebar === "menu"} asideName="منو" onClose={() => dispatch(hideMenuSidebar())}>
            <div className="flex flex-col h-full justify-center gap-5">
                <div className="flex flex-col items-center justify-center gap-1 py-5 border-b border-light-gray -mx-4">
                    <img alt="لوگوی نکسورا" src={nexoraLogo} className="rounded-lg w-15 h-15"/>
                    <TextAnimate animation="blurInUp" by="character" duration={3}
                                 className="text-2xl text-center [direction:ltr] text-primary-blue font-bold mt-1">
                        Nexora
                    </TextAnimate>
                    <p className="text-dark-gray text-sm">فروشگاه اینترنتی نکسورا</p>
                </div>
                <ul className="flex flex-col gap-2">
                    {menuLinks.map((l) => {
                        const Icon = l.icon;
                        return (
                            <li key={l.id} className="flex items-center justify-between w-full">
                                <NavLink to={l.href}
                                         className={({isActive}) => `rounded-lg p-4 w-full flex items-center justify-between hover:bg-blue-50 ${isActive ? "bg-blue-50" : ""}`}>
                                    <div className="flex items-center gap-3">
                                    <span className="bg-blue-100 p-2 text-primary-blue rounded-lg">
                                        <Icon className="text-2xl"/>
                                    </span>
                                        <span className="text-dark-gray">{l.label}</span>
                                    </div>

                                    <LeftArrow className="w-3 h-3"/>
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>

                <p className="mt-auto text-dark-gray text-sm border-t border-light-gray -mx-4 py-4 flex items-center justify-center gap-1.5">
                    <span className="mt-1">&copy;</span>
                    <span>تمامی حقوق برای نکسورا محفوظ است</span>
                </p>
            </div>
        </Sidebar>
    );
}

export default MenuSidebar;