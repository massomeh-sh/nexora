import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import store from "./store";
import {Toaster} from "sonner";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
                <App/>
        </Provider>
        <Toaster position="top-center" toastOptions={{
            unstyled: true,
            classNames: {
                toast: 'bg-white border border-neutral-200 p-4 rounded-lg flex items-center gap-3 shadow-md w-full',
                title: 'text-neutral-900 font-medium',
                description: 'text-neutral-500 text-sm',
                success: 'border-green-500 bg-green-50 text-green-900',
                error: 'border-red-500 bg-red-50 text-red-900',
            },
        }}/>
    </StrictMode>,
)
