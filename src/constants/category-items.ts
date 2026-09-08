import type {CategoryItem} from "../types/category.ts";
import lavazemeBarghi from "../assets/img/lavazeme-barghi.png";
import lavazemeKhane from "../assets/img/lavazeme-khane.png";
import laptop from "../assets/img/laptop.png";
import mobile from "../assets/img/mobile.png";
import fashion from "../assets/img/fashion.png";
import petShop from "../assets/img/petshop.png";
import beauty from "../assets/img/beauty.png";

export const categoryItems: CategoryItem[] = [
    {imageSrc: laptop, title: "لپ تاپ", slug: "/category/laptop"},
    {imageSrc: mobile, title: "موبایل", slug: "/category/mobile"},
    {imageSrc: lavazemeBarghi, title: "لوازم خانگی برقی", slug: "/category/home-appliances"},
    {imageSrc: lavazemeKhane, title: "خانه و آشپزخانه", slug: "/category/home-kitchen"},
    {imageSrc: fashion, title: "مد و پوشاک", slug: "/category/fashion"},
    {imageSrc: beauty, title: "آرایشی بهداشتی", slug: "/category/beauty"},
    {imageSrc: petShop, title: "پت شاپ", slug: "/category/pet-shop"},
]