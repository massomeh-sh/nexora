import type {JSX, ReactNode} from 'react';
import type {BreadCrumbsItem} from "../types/breadCrumbsItem.ts";
import {Link} from "react-router";

interface BreadCrumbsProps {
    // Props here
    items: BreadCrumbsItem[]
    className?: ReactNode;
}

function BreadCrumbs({items, className}: BreadCrumbsProps): JSX.Element {
    return (
        <nav aria-label="مسیر صفحه" className={`px-1 pb-5 md:-mt-3 text-sm max-md:pt-4 ${className}`}>
            <ol className="flex items-center flex-wrap gap-2 text-dark-gray">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={index} className="flex items-center gap-2">
                            {item.to && !isLast ? (
                                <Link to={item.to} className="hover:text-primary-blue">
                                    {item.label}
                                </Link>
                            ) : (
                                <span aria-current="page" className="text-black">
                                    {item.label}
                                </span>
                            )}
                            {!isLast && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                     className="rtl:rotate-0 ltr:rotate-180" aria-hidden="true">
                                    <path d="M14 8L10 12L14 16" stroke="currentColor" strokeWidth="2"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default BreadCrumbs;