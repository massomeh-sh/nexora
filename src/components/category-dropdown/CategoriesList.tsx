import {type JSX, useState} from 'react';
import {categories} from "../../constants/categories-dropdown.ts";
import {Link} from "react-router";

function CategoriesList(): JSX.Element {
    const [activeCategory, setActiveCategory] = useState<number>(1);

    const selectedCategory = categories.find((item) => item.id === activeCategory);

    return (
        <div dir="ltr" className="relative w-50 bg-lightest-gray h-full text-darkest-gray">
            <ul className="h-full w-full overflow-y-auto">
                {categories.map((item) => {
                    const Icon = item.icon;
                    return (
                        <li key={item.id} dir="rtl"
                            className={`relative w-full font-medium ${activeCategory === item.id ? "bg-white border-l border-dark-gray" : ""}`}>
                            <Link to={`/products?category=${item.slug}`}  type="button"
                                  onMouseEnter={() => setActiveCategory(item.id)}
                                  onFocus={() => setActiveCategory(item.id)}
                                  className="flex w-full p-5 items-center justify-between cursor-pointer hover:bg-white">
                                <span
                                    className={`flex gap-2 ${activeCategory === item.id ? "text-primary-blue" : ""} pointer-events-none`}>
                                    <Icon aria-hidden
                                          className={`text-dark-gray ${activeCategory === item.id ? "text-primary-blue" : ""}`}/>
                                    <span>{item.name}</span>
                                </span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
            {activeCategory !== null && selectedCategory && (
                <div
                    className={`absolute top-0 right-full h-full bg-white flex flex-col gap-6 p-5 w-70 overflow-y-auto shadow-lg rounded-bl-lg`}>
                    <Link to={`/products?category=${selectedCategory.slug}`}
                          className="flex items-center gap-2 ml-auto text-blue-800">
                        <svg aria-hidden xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24"
                             viewBox="0 0 24 24">
                            <path
                                d="M1.293,12.707a1,1,0,0,1,0-1.414l5-5A1,1,0,0,1,7.707,7.707L4.414,11H22a1,1,0,0,1,0,2H4.414l3.293,3.293a1,1,0,1,1-1.414,1.414Z"/>
                        </svg>
                        <span className="font-semibold">همه ی
                            محصولات {selectedCategory?.name}</span>
                    </Link>
                    <ul className="flex flex-col gap-2">
                        {selectedCategory.children.map((child) => (
                            <li key={child.id}
                                className="text-dark-gray hover:text-primary-blue border-b border-black ml-auto p-3">
                                <Link to={`/products?category=${child.slug}`}>
                                    {child.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>);
}

export default CategoriesList;