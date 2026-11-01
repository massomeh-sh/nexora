import {queryClient} from "@/routes/router.tsx";
import {getOrders} from "@/api/order.ts";
import store from "@/store";
import {redirect} from "react-router";
import {getMe} from "@/api/auth.ts";
import {setUser} from "@/store/user/userSlice.ts";


export async function ensureAuth() {
    if (store.getState().user.isAuthenticated) return true;

    try {
        const user = await queryClient.query({
            queryKey: ["me"],
            queryFn: getMe,
            staleTime: 5 * 60 * 1000,
        });
        store.dispatch(setUser(user));
        return true;
    } catch {
        return false;
    }
}

export async function checkoutLoader() {
    if (!await ensureAuth()) {
        throw redirect("/auth")
    }

    await queryClient.query({
        queryKey: ["checkout"],
        queryFn: getOrders
    });

    return null;
}