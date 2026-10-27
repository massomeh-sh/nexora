import type {NavItem} from "@/types/nav.types.ts";
import {
    TbHome,
    TbCategory,
    TbShoppingCart,
    TbUser,
    TbBasket,
} from "react-icons/tb";

export const mobileNavLinks: NavItem[] = [
    {id: "home", label: "خانه", href: "/", icon: TbHome},
    {id: "category", label: "دسته بندی", href: "/categories", icon: TbCategory},
    {id: "products", label: "محصولات", href: "/products", icon: TbShoppingCart},
    {id: "cart", label: "سبد خرید", href: "/cart", icon: TbBasket},
    {id: "profile", label: "پروفایل من", href: "/dashboard", icon: TbUser},
]