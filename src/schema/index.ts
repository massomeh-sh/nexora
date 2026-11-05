import {z} from "zod";

const PASSWORD_RULE = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const PHONE_RULE = /^(\+98|0)?9\d{9}$/;


export const signupSchema = z.object({
    name: z.string().min(1, "لطفا نام خود را وارد کنید").max(50, "نام و نام خانوادگی نمیتواند بیشتر از ۵۰ کاراکتر باشد"),
    email: z.string().min(1, "لطفا ایمیل خود را وارد کنید").email("لطفا یک ایمیل معتبر وارد کنید"),
    phone: z.string().min(1, "لطفا شماره تلفن خود را وارد کنید").regex(PHONE_RULE,
        "لطفا یک شماره تلفن معتبر وارد کنید."),
    password: z.string().min(1, "لطفا رمز عبور را وارد کنید").regex(PASSWORD_RULE,
        "رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، کوچک، عدد باشد"
    ),
    confirmPassword: z.string().min(1, "لطفا تکرار رمز عبور را وارد کنید"),
    agreement: z.literal(true, {error: "برای ثبت نام باید با شرایط استفاده موافقت کنید"})
}).refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار رمز عبور یکسان نیستند",
    path: ["confirmPassword"],
});


export const signInSchema = z.object({
    email: z.string().min(1, "لطفا ایمیل خود را وارد کنید").email("لطفا یک ایمیل معتبر وارد کنید."),
    password: z.string().min(1, "لطفا رمز خود را وارد کنید").regex(PASSWORD_RULE,
        "رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد"
    )
});

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, "لطفا این قسمت را خالی نگذارید").email("لطفا یک ایمیل معتبر وارد کنید")
});


export const resetPasswordSchema = z.object({
    password: z.string().min(1, "لطفا رمز عبور را وارد کنید").regex(PASSWORD_RULE,
        "رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد"
    ),
    confirmPassword: z.string().min(1, "لطفا تکرار رمز عبور را وارد کنید"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار رمز عبور یکسان نیستند",
    path: ["confirmPassword"],
})


export const createOrderSchema = z.object({
    name: z.string().min(1, "لطفا نام خود را وارد کنید").max(50, "نام و نام خانوادگی نمیتواند بیشتر از ۵۰ کاراکتر باشد"),
    phone: z.string().min(1, "لطفا شماره تلفن خود را وارد کنید").regex(PHONE_RULE,
        "لطفا یک شماره تلفن معتبر وارد کنید."),
    province: z.string().min(1, "لطفا نام استان محل اقامت خود را انتخاب کنید"),
    city: z.string().min(1, "لطفا شهر محل اقامت خود را انتخاب کنید"),
    postCode: z.string().min(1, "لطفا کد پستی خود را وارد کنید").regex(/^\d{9,10}$/, "کد پستی باید ۹ یا ۱۰ رقم باشد"),
    address: z.string().min(1, "لطفا آدرس محل اقامت خود را وارد کنید").min(10, 'آدرس باید حداقل ۱۰ کاراکتر باشد').max(300, 'آدرس بیش از حد طولانی است'),
    notes:
        z.string(),
    paymentMethod:
        z.enum(["zarinpal", "cash_on_delivery"], {error: "لطفا روش پرداخت را انتخاب کنید"})
})