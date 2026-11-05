import type {ComponentType, SVGProps} from "react";

export type PaymentMethodValue = "zarinpal" | "cash_on_delivery";

export interface PaymentMethod {
    value: PaymentMethodValue;
    title: string;
    desc: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    submitLabel: string;
}


export interface OrderItems {
    product: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
}

export interface ShippingAddress {
    fullName: string;
    receiverPhone: string;
    province: string;
    city: string;
    postalCode: string;
    address: string;
}

export interface OrderData {
    _id: string;
    user: string;
    items: OrderItems[];
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethodValue;
    note: string;
    itemsPrice: number;
    shippingPrice: number;
    totalPrice: number;
    createdAt: string;
}

export interface CreateOrderProps {
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethodValue;
    note?: string;
}


export interface CreateOrderResponse {
    success: boolean;
    data: OrderData;

}
