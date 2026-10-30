import {type JSX, useState} from 'react';
import {categories} from "@/constants/categories-dropdown.ts";
import type {CategoriesList} from "@/types/nav.types.ts";
import {Link} from "react-router";
import {MdKeyboardArrowLeft} from "react-icons/md";

function CategoriesPage(): JSX.Element {
    const [selectedCategory, setSelectedCategory] = useState<CategoriesList>(() => categories[0]);

    return (
        <section
            className="grid items-stretch grid-cols-[25%_80%] h-[calc(100vh-var(--header-height)-4.75rem)] -mx-6 -my-8 overflow-hidden bg-white">
            <ul className="flex h-full min-h-0 flex-col overflow-y-auto scrollbar-none">
                {categories.map((c) => {
                    const Icon = c.icon;
                    return (
                        <li
                            key={c.id}
                            className={`flex-1 border-b border-l ${selectedCategory.id === c.id ? "border-white bg-white" : "border-gray-200 bg-gray-100"}`}>
                            <button onClick={() => setSelectedCategory(c)}
                                    className="flex min-h-20 w-full flex-col items-center justify-center gap-3 p-5 text-xs text-dark-gray">
                                <Icon className="w-5"/>
                                <span>
                                    {c.name}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className="min-h-0 min-w-0 bg-white overflow-y-auto">
                {selectedCategory && (
                    <ul className="py-5 px-5 flex flex-col w-full">
                        <li className="text-primary-blue text-sm mb-5">
                            <Link to={`/products?category=${selectedCategory.slug}`} className="flex items-center">
                                <span>همه محصولات </span>
                                <span>{selectedCategory.name}</span>
                                <MdKeyboardArrowLeft size={22}/>
                            </Link>
                        </li>
                        {selectedCategory.children.map((c) => (
                            <li key={c.id} className="w-full">
                                <Link to={`/products?category=${c.slug}`}
                                      className="block w-full py-5 border-b border-light-gray">{c.title}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

export default CategoriesPage;