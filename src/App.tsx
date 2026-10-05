import {RouterProvider} from "react-router";
import router, {queryClient} from "./routes/router.tsx";
import {QueryClientProvider} from "@tanstack/react-query";


function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}/>
            </QueryClientProvider>
        </>)
}

export default App
