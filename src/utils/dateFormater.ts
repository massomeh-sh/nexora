export const dateFormater = (date: string) => {
    return new Date(date).toLocaleDateString("fa-IR", {
        year: 'numeric',
        month: "short",
        day: "numeric",
    });
}