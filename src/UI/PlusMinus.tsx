function PlusMinus({open}: { open: boolean }) {
    const bar = "absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 rounded bg-current transition-transform duration-300";

    return (
        <span
            className={`relative block h-4 w-2.5 transition-transform duration-300 ease-in-out ${open ? "rotate-180" : "rotate-0"}`}>
            <span className={bar}/>
            <span className={`${bar} ${open ? "rotate-0" : "rotate-90"}`}/>
        </span>
    );
}

export default PlusMinus;