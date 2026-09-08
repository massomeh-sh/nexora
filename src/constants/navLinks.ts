import type {NavLink} from "../types/nav.types.ts";
import homeIcon from "../assets/icons/home-smile-svgrepo-com.svg";
import productsIcon from "../assets/icons/shop-svgrepo-com.svg";
import blogIcon from "../assets/icons/newspaper-6-svgrepo-com.svg";
import aboutUsIcon from "../assets/icons/about-us-svgrepo-com.svg";

export const navLinks: NavLink[] = [
    {id: "home", label: "خانه", href: "/", icon: homeIcon},
    {id: "products", label: "محصولات", href: "/products", icon: productsIcon},
    {id: "blogs", label: "بلاگ ها", href: "/blogs", icon: blogIcon},
    {id: "about", label: "درباره ما", href: "/about", icon: aboutUsIcon},
]