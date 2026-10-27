import {type JSX, useState} from 'react';
import {FaRegStar, FaStar} from "react-icons/fa";

interface StarRatingProps {
    rating: number;
    updateRating: (rating: number) => void;
}


const RATING_LABELS = ["خیلی بد", "ضعیف", "متوسط", "خوب", "عالی"] as const;

function StarRating({rating, updateRating}: StarRatingProps): JSX.Element {
    const [hover, setHover] = useState(0);
    const activeValue = hover || rating;

    return (
        <div className="flex flex-col gap-1 items-center justify-center">
            <ul onMouseLeave={() => setHover(0)}
                className="flex items-center gap-2">
                {Array.from({length: 5}).map((_, index) => {
                    const value = index + 1;
                    const Icon = value <= activeValue ? FaStar : FaRegStar;
                    return (
                        <li key={value}>
                            <button onClick={() => updateRating(value)} onMouseEnter={() => setHover(value)}
                                    type="button" aria-label={`${value}ستاره `}>
                                <Icon className="text-yellow-300"
                                      size={25}
                                />
                            </button>
                        </li>
                    );
                })}
            </ul>
            <p className="text-sm text-dark-gray">{activeValue ? RATING_LABELS[activeValue - 1] : "برای امتیاز دادن ستاره ها را لمس کنید"}</p>
        </div>
    )
        ;
}

export default StarRating;