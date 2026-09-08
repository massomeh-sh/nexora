import type {JSX} from 'react';
import ProductImageSlider from "../components/product/ProductImageSlider.tsx";
import AmazingOffers from "../components/amazingOffers/AmazingOffers.tsx";
import CategoryBox from "../components/main-category/CategoryBox.tsx";
import QuickViewModal from "../components/quick-view/QuickViewModal.tsx";

function HomePage(): JSX.Element {
    return (
        <section>
            <ProductImageSlider/>
            <QuickViewModal/>
            <main className="px-32 max-lg:px-6">
                <CategoryBox/>
                <AmazingOffers/>
            </main>
        </section>
    );
}

export default HomePage;