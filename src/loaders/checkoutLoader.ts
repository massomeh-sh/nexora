import {ensureAuth} from "@/utils/ensureAuth.ts";
import {redirect} from "react-router";

export async function checkoutLoader() {
    const isAuthenticated = await ensureAuth();

    if (!isAuthenticated) throw redirect("/auth");

    return null;
}