import type {Cart, LocalCartItem} from "../../types/cart.ts";

export interface CartState {
    localItems: LocalCartItem[];
    cart: Cart | null;
}