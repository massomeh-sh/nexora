import {useMutation} from "@tanstack/react-query";
import {updateCartItem} from "../api/cart.ts";
import type {CartResponse} from "../types/cart.ts";
import {queryClient} from "../routes/router.tsx";

function useUpdateCartMutation() {
    return useMutation({
        mutationFn: updateCartItem,
        onMutate: async ({itemId, quantity}) => {
            await queryClient.cancelQueries({queryKey: ["cart"]});

            const previousCart = queryClient.getQueryData<CartResponse>(["cart"])

            queryClient.setQueryData<CartResponse>(["cart"], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        items: old.data.items.map((item) => (item._id === itemId ? {...item, quantity} : item))
                    }
                }
            });
            return {previousCart};
        },
        onError: (_err, _variable, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(["cart"], context.previousCart);
            }
        }
    });
}


export default useUpdateCartMutation;