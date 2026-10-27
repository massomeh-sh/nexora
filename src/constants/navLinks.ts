import type {NavItem} from "../types/nav.types.ts";
import {TbHome, TbShoppingCart} from "react-icons/tb";
import {FaBlogger} from "react-icons/fa";
import {HiUserGroup} from "react-icons/hi";
import {IoCall} from "react-icons/io5";

export const navLinks: NavItem[] = [
    {id: "home", label: "خانه", href: "/", icon: TbHome},
    {id: "products", label: "محصولات", href: "/products", icon: TbShoppingCart},
    {id: "blogs", label: "وبلاگ", href: "/weblog", icon: FaBlogger},
    {id: "about", label: "درباره ما", href: "/about-us", icon: HiUserGroup},
    {id: "contact", label: "تماس با ما", href: "/contact", icon: IoCall},
]