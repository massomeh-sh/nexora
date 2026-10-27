import {useLocation, useNavigate} from "react-router";

export function useSheetRoute(name: string) {
    const location = useLocation();
    const navigate = useNavigate();
    const isOpen = location.state?.sheet === name;

    const open = () => {
        navigate({pathname: location.pathname, search: location.search}, {state: {sheet: name}});
    }

    const close = () => {
        if (isOpen) navigate(-1);
    }

    return {isOpen, open, close};
}