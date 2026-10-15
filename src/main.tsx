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
                toast:
                    "flex items-center gap-3 w-[356px] rounded-xl border border-[#262626] bg-[#1A1A1A] px-4 py-3.5 shadow-lg",
                title: "text-[13px] font-semibold text-[#F0F0F0]",
                description: "text-[11px] text-[#636363]",
                actionButton:
                    "text-[11px] font-semibold px-3 py-1.5 rounded-md bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors",
                cancelButton:
                    "text-[11px] font-medium text-[#636363] hover:text-[#999] transition-colors",
                closeButton: "text-[#636363] hover:text-[#999] transition-colors",
                success:
                    "border-l-[3px] !border-l-green-500 [&_[data-icon]]:text-green-500",
                info: "border-l-[3px] !border-l-blue-500 [&_[data-icon]]:text-blue-500",
                error: "border-l-[3px] !border-l-red-500 [&_[data-icon]]:text-red-500",
            },
        }}/>
    </StrictMode>,
)
