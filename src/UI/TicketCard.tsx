import type {JSX, ReactNode} from 'react';


interface TicketCardProps {
    children: ReactNode;
    ticketHeader?: ReactNode;
    className?: string;
}

function TicketCard({children, ticketHeader, className = ""}: TicketCardProps): JSX.Element {
    return (
        <div className={`bg-white rounded-lg overflow-hidden shadow-sm ${className}`}>
            {ticketHeader}
            {children}
        </div>
    );
}

export default TicketCard;