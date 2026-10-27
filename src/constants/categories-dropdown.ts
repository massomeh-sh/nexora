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
        id: 1, name: "موبایل", icon: MobileIcon, slug: "موبایل", children: [
            {id: 12, title: "گوشی موبایل", slug: "گوشی-موبایل"},
            {id: 13, title: "لوازم جانبی موبایل", slug: "لوازم-جانبی-موبایل"},
            {id: 14, title: "قاب و محافظ", slug: "قاب-محافظ-موبایل"},
        ]
    },
    {
        id: 2, name: "لپ تاپ", icon: LaptopIcon, slug: "لپ-تاپ", children: [
            {id: 22, title: "لپ‌تاپ اداری", slug: "لپ-تاپ-اداری"},
            {id: 23, title: "لپ‌تاپ گیمینگ", slug: "لپ-تاپ-گیمینگ"},
            {id: 24, title: "کیف و کوله لپ‌تاپ", slug: "کیف-کوله-لپ-تاپ"},
        ]
    },
    {
        id: 3,
        name: "خانه-آشپزخانه",
        icon: SofaIcon,
        slug: "خانه-آشپزخانه",
        children: [
            {id: 32, title: "ظروف آشپزخانه", slug: "لوازم-آشپزخانه"},
            {id: 33, title: "دکوراسیون", slug: "دکوراسیون-منزل"},
        ]
    },
    {
        id: 4,
        name: "لوازم خانگی برقی",
        icon: FridgeIcon,
        slug: "لوازم-خانگی-برقی",
        children: [
            {id: 41, title: "تلویزیون", slug: "تلویزیون"},
            {id: 42, title: "لوازم صوتی و تصویری", slug: "ویدئو-صوت-سرگرمی"},
        ]
    },
    {
        id: 5,
        name: "آرایشی بهداشتی",
        icon: MakeupIcon,
        slug: "بهداشتی-آرایشی",
        children: [
            {id: 51, title: "مراقبت پوست", slug: "مراقبت-پوست"},
            {id: 52, title: "عطر و ادکلن", slug: "عطر-ادکلن"},
        ]
    },
    {
        id: 6, name: "مد و پوشاک", icon: ClothesIcon, slug: "مد-پوشاک", children: [
            {id: 61, title: "پوشاک مردانه", slug: "پوشاک-مردانه"},
            {id: 62, title: "پوشاک زنانه", slug: "پوشاک-زنانه"},
        ]
    },
    {
        id: 7, name: "پت شاپ", icon: PetFoodIcon, slug: "لوازم-حیوانات-خانگی", children: [
            {id: 71, title: "غذای حیوانات خانگی", slug: "غذای-حیوانات-خانگی"},
            {id: 72, title: "لوازم جانبی حیوانات", slug: "لوازم-جانبی-حیوانات"},
            {id: 73, title: "بهداشت و درمان حیوانات", slug: "بهداشت-درمان-حیوانات"},
        ]
    },
];