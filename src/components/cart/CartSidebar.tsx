import type {JSX} from 'react';
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import Sidebar from "../../UI/Sidebar.tsx";
import {hideCartSidebar} from "../../store/ui/uiSlice.ts";
import CartSidebarCard from "./CartSidebarCard.tsx";
import emptyCartSidebar from "../../assets/icons/empty-cart-sidebar.svg";
import {useClearCart} from "../../hooks/useClearCart.ts";
import {clearLocalCart, getItemVariantId} from "../../store/cart/cartSlice.ts";
import {useDispatch} from "react-redux";

function CartSidebar(): JSX.Element {
    const activeSidebar = useAppSelector(state => state.ui.activeSidebar);
    const cart = useAppSelector(state => state.cart);
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const dispatch = useDispatch();

    const {mutate: mutateClearCart} = useClearCart();


    let cartItems = cart.localItems;

    if (isAuthenticated && cart.cart) {
        cartItems = cart.cart.items;
    }

    const handleClearCart = () => {
        if (isAuthenticated) {
            mutateClearCart();
        } else {
            dispatch(clearLocalCart());
        }
    }

    return (
        <Sidebar isOpen={activeSidebar === "cart"} asideName="سبد خرید" onClose={() => dispatch(hideCartSidebar())}>
            {cartItems.length > 0 && <button className="cursor-pointer py-2 text-primary-blue hover:text-blue-700"
                                             onClick={handleClearCart}>حذف همه موارد</button>
            } {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
                <img src={emptyCartSidebar} alt="سبد خرید خالی است" className="w-52"/>
                <p className="text-center mt-2">لیست محصولات سبد خرید شما در حال حاضر خالی است.</p>
            </div>) : (
            <ul>
                {isAuthenticated && cart.cart ? (
                    cart.cart.items.map((item) => (
                        <li key={`${item.product._id}-${getItemVariantId(item) ?? "no-variant"}`}
                            className="not-last:border-b not-last:border-light-gray">
                            <CartSidebarCard
                                product={item.product}
                                variantId={item.variantId}
                                productQuantity={item.quantity}
                                itemId={item._id}
                                isAuthenticated={true}
                            />
                        </li>
                    ))
                ) : (
                    cart.localItems.map((item) => (
                        <li key={`${item.product._id}-${getItemVariantId(item) ?? "no-variant"}`}
                            className="not-last:border-b not-last:border-light-gray">
                            <CartSidebarCard
                                product={item.product}
                                variantId={item.variantId}
                                productQuantity={item.quantity}
                                isAuthenticated={false}
                            />
                        </li>
                    ))
                )}
            </ul>)}
        </Sidebar>
    );
}

export default CartSidebar;