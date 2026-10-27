import type {CategoryItem} from "../types/category.ts";
import lavazemeBarghi from "../assets/img/lavazeme-barghi.png";
import lavazemeKhane from "../assets/img/lavazeme-khane.png";
import laptop from "../assets/img/laptop.png";
import mobile from "../assets/img/mobile.png";
import fashion from "../assets/img/fashion.png";
import petShop from "../assets/img/petshop.png";
import beauty from "../assets/img/beauty.png";

export const categoryItems: CategoryItem[] = [
    {imageSrc: laptop, title: "لپ تاپ", categorySlug: "لپ-تاپ"},
    {imageSrc: mobile, title: "موبایل", categorySlug: "گوشی-موبایل"},
    {imageSrc: lavazemeBarghi, title: "لوازم خانگی برقی", categorySlug: "لوازم-خانگی-برقی"},
    {imageSrc: lavazemeKhane, title: "خانه و آشپزخانه", categorySlug: "خانه-آشپزخانه"},
    {imageSrc: fashion, title: "مد و پوشاک", categorySlug: "مد-پوشاک"},
    {imageSrc: beauty, title: "آرایشی بهداشتی", categorySlug: "بهداشتی-آرایشی"},
    {imageSrc: petShop, title: "پت شاپ", categorySlug: "لوازم-حیوانات-خانگی"},
]