import NProgress from "nprogress";
import {useEffect} from "react";
import "nprogress/nprogress.css";
import {useNavigation} from "react-router";

NProgress.configure({showSpinner: false});

function TopLoadingBar() {
    const navigation = useNavigation();

    useEffect(() => {
        if (navigation.state === "loading") NProgress.start();
        else NProgress.done();
    }, [navigation.state]);

    return null;
}

export default TopLoadingBar;