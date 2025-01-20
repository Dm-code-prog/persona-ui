import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

import Routes from "./container/Routes";
import {LocalProgramStatusModal} from "@/components/app/LocalBackendStatusModal/LocalBackendStatusModal.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import ErrorBoundary from "@/components/app/ErrorBoundary/ErrorBoundary.tsx";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
        }
    }
})


function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <Toaster/>
                <LocalProgramStatusModal/>
                <Routes/>
            </ErrorBoundary>
        </QueryClientProvider>
    )
}

export default App;
