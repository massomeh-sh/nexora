import {type JSX, useState} from 'react';
import type {Product} from "../../types/product.ts";
import ProductReview from "./ProductReview.tsx";
import ProductQuestions from "./ProductQuestions.tsx";
import ReviewOverlay from "./ReviewOverlay.tsx";
import ProductStandPoint from "./ProductStandPoint.tsx";

interface ProductDetailsProps {
    product: Product;
}

type activeBtn = "description" | "review" | "Q&A";

const detailsBtn: { title: string, id: activeBtn }[] = [{
    title: "معرفی",
    id: "description"
}, {
    title: "امتیاز و دیدگاه کاربران",
    id: "review",
}, {title: "پرسش ها", id: "Q&A"}];


function ProductDetails({product}: ProductDetailsProps): JSX.Element {
    const [activeBtn, setActiveBtn] = useState<activeBtn>('description');

    return (
        <>
            <div className="flex flex-col gap-5 mt-10 mb-50">

                <ul className="bg-white flex items-center gap-8 max-lg:gap-6 px-6 py-7 max-lg:py-4 rounded-lg">
                    {detailsBtn.map((btn) => (<li key={btn.id} className="text-lg max-lg:text-[17px]">
                        <button onClick={() => setActiveBtn(btn.id)}
                                role="presentation"
                                active-data={btn.id === activeBtn ? "" : undefined}
                                className={`underline-reveal active-data cursor-pointer`}>{btn.title}</button>
                    </li>))}
                </ul>

                <div className="bg-white px-6 py-7 rounded-lg">
                    {activeBtn === "description" &&
                        <p className="max-lg:text-[14px] leading-6">{product.description}</p>}
                    {activeBtn === "review" && <ProductReview product={product}/>}
                    {activeBtn === "Q&A" && <ProductQuestions/>}
                </div>
            </div>
            <ReviewOverlay product={product}/>
            <ProductStandPoint/>
        </>
    );
}

export default ProductDetails;