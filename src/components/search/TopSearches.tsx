import type {JSX} from 'react';
import {Link} from "react-router";
import {topSearches} from "../../constants/topSearches.ts";

function TopSearches(): JSX.Element {
    return (
        <div>
            <h2 className="text-darkest-gray text-lg">جستجو های برتر</h2>
            <div className="flex gap-2 flex-wrap mt-2">
                {topSearches.map((s) => (
                    <Link to={s.slug} key={s.id}
                          className="inline-block border hover:text-primary-blue text-dark-gray outline-2 outline-transparent hover:outline-primary-blue cursor-pointer border-light-gray px-3 py-1 text-sm transition-colors duration-300 rounded-sm">{s.name}</Link>
                ))}
            </div>
        </div>
    );
}

export default TopSearches;