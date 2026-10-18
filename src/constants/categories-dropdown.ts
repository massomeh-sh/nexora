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
        id: 1, name: "موبایل", icon: MobileIcon, slug: "mobile", children: [
            {id: 12, title: "گوشی موبایل", slug: "mobile"},
            {id: 13, title: "لوازم جانبی موبایل", slug: "mobile-accessories"},
            {id: 14, title: "قاب و محافظ", slug: "phone-case"},
        ]
    },
    {
        id: 2, name: "لپ تاپ", icon: LaptopIcon, slug: "laptop", children: [
            {id: 22, title: "لپ‌تاپ اداری", slug: "office-laptop"},
            {id: 23, title: "لپ‌تاپ گیمینگ", slug: "gaming-laptop"},
            {id: 24, title: "کیف و کوله لپ‌تاپ", slug: "laptop-bag"},
        ]
    },
    {
        id: 3,
        name: "لوازم آشپزخانه",
        icon: SofaIcon,
        slug: "lavazem-khane",
        children: [
            {id: 32, title: "ظروف آشپزخانه", slug: "kitchenware"},
            {id: 33, title: "دکوراسیون", slug: "decoration"},
        ]
    },
    {
        id: 4,
        name: "لوازم خانگی برقی",
        icon: FridgeIcon,
        slug: "appliances",
        children: [
            {id: 41, title: "تلویزیون", slug: "tv"},
            {id: 42, title: "لوازم صوتی و تصویری", slug: "video-audio-entertainment"},
        ]
    },
    {
        id: 5,
        name: "آرایشی بهداشتی",
        icon: MakeupIcon,
        slug: "behdashti-arayeshi",
        children: [
            {id: 51, title: "مراقبت پوست", slug: "skin-care"},
            {id: 52, title: "عطر و ادکلن", slug: "perfume"},
        ]
    },
    {
        id: 6, name: "مد و پوشاک", icon: ClothesIcon, slug: "fashion", children: [
            {id: 61, title: "پوشاک مردانه", slug: "fashion-men"},
            {id: 62, title: "پوشاک زنانه", slug: "fashion-women"},
        ]
    },
    {
        id: 7, name: "پت شاپ", icon: PetFoodIcon, slug: "petshop", children: [
            {id: 71, title: "غذای حیوانات خانگی", slug: "pet-food"},
            {id: 72, title: "لوازم جانبی حیوانات", slug: "pet-accessories"},
            {id: 73, title: "بهداشت و درمان حیوانات", slug: "pet-health"},
        ]
    },
];