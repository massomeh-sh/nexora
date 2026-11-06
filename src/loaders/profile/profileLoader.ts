import {ensureAuth} from "@/utils/ensureAuth.ts";
import {redirect} from "react-router";

export async function profileLoader() {
    if (!await ensureAuth()) {
        redirect("/login");
    }

    return null;
}