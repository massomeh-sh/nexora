import type {JSX} from 'react';
import {hideModal, setSelectedProduct} from "../../store/ui/uiSlice.ts";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import {removeLocalFromWishlist} from "../../store/wishlist/wishlistSlice.ts";
import useRemoveItemFromWishlist from "../../hooks/useRemoveItemFromWishlist.ts";
import ConfirmationModal from "../../UI/ConfirmationModal.tsx";


function WishlistConfirmationModal(): JSX.Element {
    const isOpenModal = useAppSelector(state => state.ui.confirmationModal);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const selectedProduct = useAppSelector(state => state.ui.selectedProduct);
    const {mutate: removeFromWishlist} = useRemoveItemFromWishlist();

    const closeModal = () => {
        dispatch(hideModal());
        dispatch(setSelectedProduct(null))
    }

    const deleteItem = () => {
        if (!selectedProduct) return;
        if (isAuthenticated) {
            removeFromWishlist(selectedProduct._id)
        } else {
            dispatch(removeLocalFromWishlist(selectedProduct._id));
        }
        dispatch(hideModal());
    }

    return (
        <ConfirmationModal open={isOpenModal === "wishlist"} title="حذف از علاقه مندی"
                           message="آیا از حذف این کالا از لیست علاقه مندی اطمینان دارید؟" confirmText="حذف کالا"
                           onConfirm={deleteItem} onClose={closeModal}/>
    );
}

export default WishlistConfirmationModal;