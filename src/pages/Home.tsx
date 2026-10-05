import {type JSX} from 'react';
import ProductImageSlider from "../components/ProductImageSlider.tsx";
import AmazingOffers from "../components/amazingOffers/AmazingOffers.tsx";
import CategoryBox from "../components/main-category/CategoryBox.tsx";

function HomePage(): JSX.Element {

    return (
        <section>
            <div className="-mx-32 max-lg:-mx-6 -my-8 pb-4">
                <ProductImageSlider/>
            </div>
            <main>
                <CategoryBox/>
                <AmazingOffers/>
            </main>
        </section>
    );
}

export default HomePage;