import type {ShareItem} from "../types/shareItems.ts";
import TelegramIcon from "../assets/icons/telegram.svg?react";
import WhatsappIcon from "../assets/icons/whatsapp.svg?react";
import GmailIcon from "../assets/icons/gmail.svg?react";
import FacebookIcon from "../assets/icons/facebook.svg?react";
import TwitterIcon from "../assets/icons/twitter.svg?react";

export const share: ShareItem[] = [
    {
        id: 1,
        name: "telegram",
        url: "https://t.me/share/url?url=",
        icon: TelegramIcon,
    }, {
        id: 2,
        name: "whatsapp",
        url: "https://api.whatsapp.com/send?text=",
        icon: WhatsappIcon,
    }, {
        id: 3,
        name: "gmail",
        url: `https://mail.google.com/mail/?view=cm&fs=1` +
            `&su=${encodeURIComponent("اشتراک محصول")}` +
            `&body=`,
        icon: GmailIcon,
    }, {
        id: 4,
        name: "facebook",
        url: "https://www.facebook.com/sharer/sharer.php?u=",
        icon: FacebookIcon,
    }, {
        id: 5,
        name: "twitter",
        url: "https://twitter.com/intent/tweet?url=",
        icon: TwitterIcon,
    },
]