import Modal from "../../UI/Modal.tsx";
import {useAppDispatch} from "../../hooks/useAppDispatch.ts";
import {hideModal, showCartSidebar} from "../../store/ui/uiSlice.ts";
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import {priceFormater} from "../../util/priceFormater.ts";
import ModalProductImages from "./ModalProductImages.tsx";
import {
    addLocalItem, makeSelectIsInCart, makeSelectProductQuantity,
} from "../../store/cart/cartSlice.ts";
import {useMemo, useState} from "react";
import useAddToCart from "../../hooks/useAddToCart.ts";
import DiscountPrice from "../../UI/DiscountPrice.tsx";
import UpdateQuantity from "../../UI/product/UpdateQuantity.tsx";

function QuickViewModal() {
    const isModalOpen = useAppSelector(state => state.ui.isQuickViewModalOpen);
    const selectedProduct = useAppSelector(state => state.ui.selectedProduct);
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const selectIsInCart = useMemo(() => makeSelectIsInCart(), []);
    const currentCartItem = useAppSelector(state => {
        if (!selectedProduct) return;
        return selectIsInCart(state, selectedProduct._id)
    });

    const selectProductQuantity = useMemo(() => makeSelectProductQuantity(), []);

    const productQuantity = useAppSelector((state) => {
        if (!selectedProduct) return 1;
        return selectProductQuantity(state, selectedProduct._id);
    });

    const [quantity, setQuantity] = useState(productQuantity);

    const {mutate} = useAddToCart()

    const handleAddToCart = () => {
        if (!selectedProduct) return;
        if (isAuthenticated) {
            mutate({productId: selectedProduct._id, quantity});
            dispatch(hideModal());
            dispatch(showCartSidebar());
        } else {
            dispatch(addLocalItem({product: selectedProduct, quantity: Number(quantity)}));
            dispatch(hideModal());
            dispatch(showCartSidebar());
        }
    }

    const handleUpdateQuantity = (newQuantity: number) => {
        setQuantity(newQuantity);
    }

    if (!selectedProduct) return null;

    return (
        <Modal open={isModalOpen} close={() => dispatch(hideModal())} className="w-[90%] max-w-6xl max-h-[90%] m-auto">
            <div className="flex max-md:flex-col gap-5 p-6 relative">
                <button aria-label="بستن نمایش سریع محصولات" onClick={() => dispatch(hideModal())}
                        className="absolute bg-primary-blue text-white top-2 left-2 p-1.5 max-lg:p-0.5 cursor-pointer z-10">
                    <svg className="w-5 h-5" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button>
                <ModalProductImages product={selectedProduct} key={selectedProduct._id}/>
                <div className="w-1/2 max-md:w-full flex flex-col gap-4 px-2">
                    <h1 className="text-2xl max-md:text-lg font-normal">{selectedProduct.name}</h1>
                    <div className="flex gap-5 text-lg">
                        <DiscountPrice discount={selectedProduct.discountPrice}/>
                        <span
                            className="text-primary-blue">{priceFormater(selectedProduct.price)} تومان</span>
                    </div>
                    <ul className="flex gap-5 text-dark-gray">
                        <li className="space-x-2">
                            <svg className="inline-block" stroke="#FFBF00" fill="#FFBF00" strokeWidth="0"
                                 viewBox="0 0 24 24" height="1em"
                                 width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
                            </svg>
                            <span>{selectedProduct.rating} از ۵</span>
                        </li>
                        <li className="w-1.5 h-1.5 bg-light-gray rounded-full my-auto"></li>
                        <li>۲ دیدگاه</li>
                    </ul>
                    <div className="bg-light-gray w-full h-0.5 my-5"/>
                    <p className="text-dark-gray text-lg max-md:text-sm">{selectedProduct.description || "hi"}</p>
                    <div className="flex gap-8">
                        <p className="flex items-center gap-2">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
                                 height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M8.96456 18C8.72194 19.6961 7.26324 21 5.5 21C3.73676 21 2.27806 19.6961 2.03544 18H1V6C1 5.44772 1.44772 5 2 5H16C16.5523 5 17 5.44772 17 6V8H20L23 12.0557V18H20.9646C20.7219 19.6961 19.2632 21 17.5 21C15.7368 21 14.2781 19.6961 14.0354 18H8.96456ZM15 7H3V15.0505C3.63526 14.4022 4.52066 14 5.5 14C6.8962 14 8.10145 14.8175 8.66318 16H14.3368C14.5045 15.647 14.7296 15.3264 15 15.0505V7ZM17 13H21V12.715L18.9917 10H17V13ZM17.5 19C18.1531 19 18.7087 18.5826 18.9146 18C18.9699 17.8436 19 17.6753 19 17.5C19 16.6716 18.3284 16 17.5 16C16.6716 16 16 16.6716 16 17.5C16 17.6753 16.0301 17.8436 16.0854 18C16.2913 18.5826 16.8469 19 17.5 19ZM7 17.5C7 16.6716 6.32843 16 5.5 16C4.67157 16 4 16.6716 4 17.5C4 17.6753 4.03008 17.8436 4.08535 18C4.29127 18.5826 4.84689 19 5.5 19C6.15311 19 6.70873 18.5826 6.91465 18C6.96992 17.8436 7 17.6753 7 17.5Z"></path>
                            </svg>
                            <span>ارسال و مرجوعی</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
                                 height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM13 13.3551V14H11V12.5C11 11.9477 11.4477 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.2723 8.5 10.6656 9.01823 10.5288 9.70577L8.56731 9.31346C8.88637 7.70919 10.302 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.5855 14.4457 12.9248 13 13.3551Z"></path>
                            </svg>
                            <span>پرسش از فروشنده</span>
                        </p>
                    </div>
                    <div dir="ltr" className="mt-5 flex gap-5 max-lg:text-xs">
                        <button
                            onClick={handleAddToCart}
                            className="bg-black text-white w-full p-2 rounded-sm cursor-pointer hover:opacity-80 transition-opacity duration-300 max-md:text-sm">{currentCartItem?.isInCart ? "بروزرسانی سبد خرید" : "افزودن به سبد خرید"}</button>
                        <UpdateQuantity quantity={quantity} onQuantityChange={handleUpdateQuantity}/>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default QuickViewModal;