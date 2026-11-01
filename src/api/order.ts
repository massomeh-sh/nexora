import {apiFetch} from "@/api/apiClient.ts";

export async function getOrders() {
    return apiFetch("/api/orders/my");
}