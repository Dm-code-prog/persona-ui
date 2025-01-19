'use client'

import {useQuery} from '@tanstack/react-query'
import {AlertCircle} from 'lucide-react'

import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Link} from "react-router-dom";
import {AppConfig} from "@/config/app-config.ts";

async function checkSecrets() {
    const keys = ['elevenlabs_api_key', 'openai_api_key']
    for (const key of keys) {
        const response = await fetch(`${AppConfig.backend_url}/api/secrets/get-insecure?key=${key}`)
        if (!response.ok) {
            console.log('Secrets not configured')
            throw new Error('Secrets not configured')
        }
    }

    return true
}

export function SecretsBanner() {
    const {isError} = useQuery({
        queryKey: ['elevenlabs_api_key', 'openai_api_key'],
        queryFn: checkSecrets,
    })

    if (!isError) return null

    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4"/>
            <AlertTitle className="text-primary">Action Required</AlertTitle>
            <AlertDescription className="text-primary">
                You need to configure secrets to use the Studio.
                <Link to={'/secrets'} className="ml-2 text-blue-500">Configure now</Link>
            </AlertDescription>
        </Alert>
    )
}

