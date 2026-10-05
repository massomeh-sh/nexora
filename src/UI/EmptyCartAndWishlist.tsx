import type {JSX} from 'react';

interface EmptyCartProps {
    // Props here
    image: string;
    description: string;
    title: string;
}

function EmptyCartAndWishlist({image, description, title}: EmptyCartProps): JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center">
            <img src={image} alt={title}
                 className="w-lg max-md:w-sm h-full select-none object-cover"/>
            <p>{description}</p>
        </div>
    );
}

export default EmptyCartAndWishlist;