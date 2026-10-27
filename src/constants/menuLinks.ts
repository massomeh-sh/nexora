import type {NavItem} from "@/types/nav.types.ts";
import {FaBlogger} from "react-icons/fa";
import {HiUserGroup} from "react-icons/hi";
import {IoCall} from "react-icons/io5";
import {TbShieldCheck} from "react-icons/tb";

export const menuLinks: NavItem[] = [
    {id: "blog", label: "وبلاگ", href: "/weblog", icon: FaBlogger},
    {id: "about", label: "درباره ما", href: "/about-us", icon: HiUserGroup},
    {id: "contact", label: "تماس با ما", href: "/contact", icon: IoCall},
    {id: "rules", label: "قوانین و مقررات", href: "/nexora-rules", icon: TbShieldCheck},
]