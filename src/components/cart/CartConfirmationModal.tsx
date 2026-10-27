import type {JSX} from 'react';
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import {useDispatch} from "react-redux";
import {hideModal, setSelectedProduct} from "../../store/ui/uiSlice.ts";
import ConfirmationModal from "../../UI/ConfirmationModal.tsx";
import useRemoveCartItem from "../../hooks/useRemoveCartItem.ts";
import {removeLocalItem} from "../../store/cart/cartSlice.ts";

function CartConfirmationModal(): JSX.Element {
    const isOpenModal = useAppSelector(state => state.ui.confirmationModal);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const selectedProduct = useAppSelector(state => state.ui.selectedProduct);
    const serveCart = useAppSelector(state => state.cart.cart);

    const {mutate: mutateRemoveItem} = useRemoveCartItem();

    const closeModal = () => {
        dispatch(hideModal());
        dispatch(setSelectedProduct(undefined));
    }

    const deleteItem = () => {
        if (!selectedProduct) return;
        const itemId = serveCart?.items.find(item => item.product._id === selectedProduct._id)?._id;

        if (isAuthenticated && itemId) {
            mutateRemoveItem(itemId);
        } else {
            dispatch(removeLocalItem({productId: selectedProduct._id, variantId: selectedProduct.selectedVariantId}));
        }

        dispatch(hideModal());
    }


    return (
        <ConfirmationModal open={isOpenModal === "cart"} title="حذف از سبد خرید"
                           message="آیا از حذف این کالا از سبد خرید اطمینان دارید؟" confirmText="حذف کالا"
                           onConfirm={deleteItem}
                           onClose={closeModal}/>
    );
}

export default CartConfirmationModal;