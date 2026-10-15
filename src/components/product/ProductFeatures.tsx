import type {CSSProperties, JSX} from 'react';
import {productFeatures} from "../../constants/productFeatures.ts";

function ProductFeatures(): JSX.Element {
    return (
        <ul className="border-t border-dark-gray pt-5 mt-5 grid grid-cols-2 gap-2.5 text-dark-gray text-sm">
            {productFeatures.map((f) =>
                <li key={f.id} style={{"--icon": `url(/icons/${f.id}.svg)`} as CSSProperties}
                    className="flex flex-col items-center gap-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300 px-2 py-5 text-center font-medium before:content-[''] before:h-9 before:w-9 before:bg-primary-blue before:[mask:var(--icon)_center/contain_no-repeat]">
                    {f.title}
                </li>)}
        </ul>
    );
}

export default ProductFeatures;