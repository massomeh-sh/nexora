import type {CategoryItem} from "../types/category.ts";
import lavazemeBarghi from "../assets/img/lavazeme-barghi.png";
import lavazemeKhane from "../assets/img/lavazeme-khane.png";
import laptop from "../assets/img/laptop.png";
import mobile from "../assets/img/mobile.png";
import fashion from "../assets/img/fashion.png";
import petShop from "../assets/img/petshop.png";
import beauty from "../assets/img/beauty.png";

export const categoryItems: CategoryItem[] = [
    {imageSrc: laptop, title: "لپ تاپ", categorySlug: "laptop"},
    {imageSrc: mobile, title: "موبایل", categorySlug: "mobile"},
    {imageSrc: lavazemeBarghi, title: "لوازم خانگی برقی", categorySlug: "appliances"},
    {imageSrc: lavazemeKhane, title: "خانه و آشپزخانه", categorySlug: "lavazem-khane"},
    {imageSrc: fashion, title: "مد و پوشاک", categorySlug: "fashion"},
    {imageSrc: beauty, title: "آرایشی بهداشتی", categorySlug: "behdashti-arayeshi"},
    {imageSrc: petShop, title: "پت شاپ", categorySlug: "petshop"},
]