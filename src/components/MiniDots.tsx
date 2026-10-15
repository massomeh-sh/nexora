function Sparkle({className}: { className: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M12 2c.6 4.8 3.2 8.4 10 10-6.8 1.6-9.4 5.2-10 10-.6-4.8-3.2-8.4-10-10 6.8-1.6 9.4-5.2 10-10z"/>
        </svg>
    );
}

interface MiniDotsLineProps {
    count: number;
}

export default function MiniDots({count = 4}: MiniDotsLineProps) {
    return (
        <div className="flex flex-col items-center w-6 max-md:rounded-full">
            <Sparkle
                className="z-10 w-6 h-6 text-primary-purple bg-white max-md:bg-light-gray max-md:rounded-full max-md:w-8 max-md:h-8 max-md:p-1"/>
            <div className="flex flex-col items-center mt-1 relative z-10 max-md:hidden">
                {Array.from({length: count}, (_, i) => {
                    return (
                        <div key={i} className={`flex flex-col items-center gap-1`}>
                            <span className={`w-[2px] ${i === 0 ? "h-2" : "h-4 mt-2"} bg-light-gray`}/>
                            <span key={i} className={`w-2 h-2 rounded-full bg-primary-purple`}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}