import {apiFetch} from "@/api/apiClient.ts";
import type {CreateOrderProps, CreateOrderResponse} from "@/types/order.ts";

export async function createOrder(data: CreateOrderProps): Promise<CreateOrderResponse> {
    return apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(data),
    });
}