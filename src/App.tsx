import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

import { createClient, Session } from '@supabase/supabase-js'

import SignIn from "./SignIn";
import { AppConfig } from './config/app-config'

import Routes from "./container/Routes";
import {LocalProgramStatusModal} from "@/components/app/LocalBackendStatusModal/LocalBackendStatusModal.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import ErrorBoundary from "@/components/app/ErrorBoundary/ErrorBoundary.tsx";
import { useEffect } from 'react'
import { useState } from 'react'
import Loader from './components/app/Loader/Loader';

export const supabase = createClient(AppConfig.supabase_url, AppConfig.supabase_key)

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
        },
    }
})


function App() {
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setIsLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setIsLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (isLoading) {
        return <Loader />
    }

    if (!session) {
        return (<SignIn />)
    }
    
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
