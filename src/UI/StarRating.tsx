import {type JSX} from 'react';
import {FaStar} from "react-icons/fa";

interface StarRatingProps {
    // Props here
    productRating: number;
}

function StarRating({productRating}: StarRatingProps): JSX.Element {

    return (
        <div className="flex items-center self-start justify-center gap-2">
            {Array.from({length: 5}).map((_, index) => {
                const starIndex = index + 1;

                if (starIndex <= Math.floor(productRating)) {
                    return (
                        <FaStar key={starIndex} className="text-amber-400"/>
                    )
                }

                if (starIndex === Math.ceil(productRating) && productRating % 1 !== 0) {
                    return (
                        <div key={starIndex} className="relative">
                            <FaStar className="text-gray-300"/>
                            <div style={{width: `${(productRating % 1) * 100}%`}}
                                 className="absolute inset-0 overflow-hidden">
                                <FaStar className="text-amber-400"/>
                            </div>
                        </div>
                    )
                }

                return (
                    <FaStar key={starIndex} className="text-gray-300"/>
                )
            })}
        </div>
    );
}

export default StarRating;