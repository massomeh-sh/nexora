import type {CategoriesList} from "../types/nav.types.ts";
import MobileIcon from "../assets/icons/mobile-svgrepo-com.svg?react";
import LaptopIcon from "../assets/icons/laptop-alt-1-svgrepo-com.svg?react";
import SofaIcon from "../assets/icons/sofa-svgrepo-com.svg?react";
import FridgeIcon from "../assets/icons/fridge-svgrepo-com.svg?react";
import MakeupIcon from "../assets/icons/makeup-fashion-svgrepo-com.svg?react";
import ClothesIcon from "../assets/icons/clothes-laundry-fashion-svgrepo-com.svg?react";
import PetFoodIcon from "../assets/icons/pet-food-paw-svgrepo-com.svg?react";

export const categories: CategoriesList[] = [
    {
        id: 1, name: "موبایل", icon: MobileIcon, slug: "/category/mobile", children: [
            {id: 12, title: "گوشی موبایل", slug: "/category/mobile/phone"},
            {id: 13, title: "لوازم جانبی موبایل", slug: "/category/mobile/mobile-accessories"},
            {id: 14, title: "قاب و محافظ", slug: "/category/mobile/phone-case"},
        ]
    },
    {
        id: 2, name: "لپ تاپ", icon: LaptopIcon, slug: "/category/laptop", children: [
            {id: 22, title: "لپ‌تاپ اداری", slug: "/category/laptop/office-laptop"},
            {id: 23, title: "لپ‌تاپ گیمینگ", slug: "/category/laptop/gaming-laptop"},
            {id: 24, title: "کیف و کوله لپ‌تاپ", slug: "/category/laptop/laptop-bag"},
        ]
    },
    {
        id: 3, name: "خانه و آشپزخانه", icon: SofaIcon, slug: "/category/home-kitchen", children: [
            {id: 32, title: "ظروف آشپزخانه", slug: "/category/home-kitchen/kitchenware"},
            {id: 33, title: "دکوراسیون", slug: "/category/home-kitchen/decoration"},
        ]
    },
    {
        id: 4, name: "لوازم خانگی برقی", icon: FridgeIcon, slug: "/category/home-appliances", children: [
            {id: 41, title: "تلویزیون", slug: "/category/home-appliances/tv"},
            {id: 42, title: "لوازم صوتی و تصویری", slug: "/category/home-appliances/video-audio-entertainment"},
        ]
    },
    {
        id: 5, name: "آرایشی بهداشتی", icon: MakeupIcon, slug: "/category/beauty", children: [
            {id: 51, title: "مراقبت پوست", slug: "/category/beauty/skincare"},
            {id: 52, title: "عطر و ادکلن", slug: "/category/beauty/perfume"},
        ]
    },
    {
        id: 6, name: "مد و پوشاک", icon: ClothesIcon, slug: "/category/fashion", children: [
            {id: 61, title: "پوشاک مردانه", slug: "/category/fashion/men-clothing"},
            {id: 62, title: "پوشاک زنانه", slug: "/category/fashion/women-clothing"},
            {id: 63, title: "کیف و کفش", slug: "/category/fashion/bags-shoes"},
            {id: 64, title: "اکسسوری", slug: "/category/fashion/accessories"},
        ]
    },
    {
        id: 7, name: "پت شاپ", icon: PetFoodIcon, slug: "/category/pet-shop", children: [
            {id: 71, title: "غذای حیوانات خانگی", slug: "/category/pet-shop/pet-food"},
            {id: 72, title: "لوازم جانبی حیوانات", slug: "/category/pet-shop/pet-accessories"},
            {id: 73, title: "بهداشت و درمان حیوانات", slug: "/category/pet-shop/pet-health"},
        ]
    },
];