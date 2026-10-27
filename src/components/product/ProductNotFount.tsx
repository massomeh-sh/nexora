import type {JSX} from 'react';
import noProductsSm from "../../assets/img/no-products-sm.png";
import noProductsLg from "../../assets/img/no-products-lg.png";

interface ProductNotFountProps {
    // Props here
}

function ProductNotFount({}: ProductNotFountProps): JSX.Element {
    return (
        <div className="flex items-center justify-center">
            <picture>
                <source srcSet={noProductsSm} media="(max-width:767px)"/>
                <source srcSet={noProductsLg}/>
                <img src="../../assets/img/no-products-lg.png" alt="محصولی یافت نشد"/>
            </picture>
        </div>
    );
}

export default ProductNotFount;