import type {JSX} from 'react';

function ProductSkeleton(): JSX.Element {
    return (
        <div className="bg-white p-5 rounded-lg" aria-busy="true">
            <ul className="grid grid-cols-4 max-md:grid-cols-2 max-md:gap-1 gap-4">
                {Array.from({length: 8}).map((_, i) => (
                    <li key={i} className="flex flex-col gap-3 p-3">
                        <div className="bg-lightest-gray animate-pulse rounded-lg aspect-square"/>
                        <div className="bg-lightest-gray animate-pulse h-4 rounded w-3/4"/>
                        <div className="bg-lightest-gray animate-pulse h-4 rounded w-1/2"/>
                        <div className="bg-lightest-gray animate-pulse h-5 rounded w-1/3"/>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductSkeleton;