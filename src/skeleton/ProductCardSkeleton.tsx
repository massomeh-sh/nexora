import type {JSX} from 'react';

function ProductCardSkeleton(): JSX.Element {
    return (
        <div className="min-w-[220px] max-lg:min-w-[150px] bg-lightest-gray p-4 max-lg:p-2 flex flex-col">
            <div
                className="w-full h-50 max-lg:h-35 bg-light-gray object-contain select-none"/>
            <p className="h-2 w-full bg-light-gray mt-5 rounded-full"></p>
            <p className="mb-8 h-2 w-3/4 bg-light-gray mt-2 rounded-full"></p>
            <div dir="ltr" className="flex flex-col mt-auto">
                <div className="w-full flex gap-2 ">
                    <p className="inline-block bg-light-gray w-1/3 h-2 rounded-full">
                    </p>
                    <p className="inline-block bg-light-gray w-1/5 h-2 rounded-full">
                    </p>
                </div>
                <p className="bg-light-gray w-2/4 h-2 mt-4 rounded-full"></p>
            </div>
        </div>
    );
}

export default ProductCardSkeleton;