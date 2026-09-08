import type {JSX} from 'react';

function AmazingOfferSkeleton(): JSX.Element {
    return (
        <div className="min-w-[220px] min-h-32 bg-lightest-gray p-4 flex flex-col group">
            <div className="relative overflow-hidden">
                <div className="w-full h-50 object-contain select-none"/>
            </div>
            <p className="line-clamp-2 mb-8">
            </p>
            <div dir="ltr" className="flex flex-col mt-auto">
                <div className="flex gap-2">
                    <span className="text-sm inline-block text-dark-gray relative">
                        <span className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-px bg-dark-gray"/>
                    </span>
                    <span className="bg-primary-red text-white px-2 rounded-full">
                </span>
                </div>
                <p className="flex gap-2"><span></span><span></span>
                </p>
            </div>
        </div>
    );
}

export default AmazingOfferSkeleton;