import type {ComponentType, SVGProps} from "react";

export type ShareBtn = "telegram" | "facebook" | "twitter" | "whatsapp" | "gmail"

export interface ShareItem {
    id: number;
    name: ShareBtn;
    url: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
}

