import {useMutation} from "@tanstack/react-query";
import {reactToProductComment} from "../api/products.ts";
import {ApiError} from "../api/apiClient.ts";
import {toast} from "sonner";
import {queryClient} from "../routes/router.tsx";

export function useReactToComment(id: string) {
    return useMutation({
            mutationKey: ["reactToComment", id],
            mutationFn: reactToProductComment,
            onSuccess:
                async () => {
                    await queryClient.invalidateQueries({
                        queryKey: ["product", id],
                    })
                },
            onError:
                (err) => {
                    const error = err instanceof ApiError ? err.message : "خطا در اضافه کردن محصول به سبد خرید"
                    toast.error(error)
                },
        }
    )
}