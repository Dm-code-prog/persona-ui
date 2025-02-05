import React, { SetStateAction, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useMutation } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config.ts";
import { queryClient } from "@/App.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { useGetSecretInsecureQuery } from "@/hooks/data/local/secrets/useGetSecretInsecureQuery"
import Loader from "@/components/app/Loader/Loader"

export default function SecretsPage() {
    const [elevenlabsKey, setElevenlabsKey] = useState("")
    const [openaiKey, setOpenaiKey] = useState("")
    const [youtubeDataApiKey, setYoutubeDataApiKey] = useState("")
    const [error, setError] = useState("")

    const { toast } = useToast()

    const defaultElevenLabsKey = useGetSecretInsecureQuery("elevenlabs_api_key")
    const defaultOpenAiKey = useGetSecretInsecureQuery("openai_api_key")
    const defaultYoutubeDataApiKey = useGetSecretInsecureQuery("youtube_data_api_key")

    const mutation = useMutation({
        mutationFn: async () => {
            const setElevenLabsKey = fetch(
                `${AppConfig.backend_url}/api/secrets/put?key=elevenlabs_api_key&value=${elevenlabsKey}`, {
                method: 'PUT',
            })
            const setOpenAIKey = fetch(
                `${AppConfig.backend_url}/api/secrets/put?key=openai_api_key&value=${openaiKey}`, {
                method: 'PUT',
            })
            const setYoutubeDataApiKey = fetch(
                `${AppConfig.backend_url}/api/secrets/put?key=youtube_data_api_key&value=${youtubeDataApiKey}`, {
                method: 'PUT',
            })
            const res = await Promise.all([setElevenLabsKey, setOpenAIKey, setYoutubeDataApiKey])
            if (res.some(r => !r.ok)) {
                throw new Error("Failed to save API keys, server responded with status code " + res.map(r => r.status).join(", "))
            }
        },
        onError: (error) => {
            setError(error.message)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['elevenlabs_api_key', 'openai_api_key']
            })

            toast({
                title: "API keys saved successfully",
            })
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        mutation.mutate()
    }

    useEffect(() => {
        if (defaultElevenLabsKey.data) {
            setElevenlabsKey(defaultElevenLabsKey.data.value)
        }
        if (defaultOpenAiKey.data) {
            setOpenaiKey(defaultOpenAiKey.data.value)
        }
        if (defaultYoutubeDataApiKey.data) {
            setYoutubeDataApiKey(defaultYoutubeDataApiKey.data.value)
        }
    }, [defaultElevenLabsKey.data, defaultOpenAiKey.data, defaultYoutubeDataApiKey.data])

    if (defaultElevenLabsKey.isLoading || defaultOpenAiKey.isLoading || defaultYoutubeDataApiKey.isLoading) {
        return <div className="flex justify-center items-center h-screen w-full">
            <Loader />
        </div>
    }

    return (
        <div className="container mx-auto py-10 w-full">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Enter your API keys for ElevenLabs and OpenAI.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="elevenlabs-key">ElevenLabs API Key</Label>
                            <Input
                                id="elevenlabs-key"
                                placeholder="Enter your ElevenLabs API key"
                                value={elevenlabsKey}
                                onChange={(e) => setElevenlabsKey(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="openai-key">OpenAI API Key</Label>
                            <Input
                                id="openai-key"
                                placeholder="Enter your OpenAI API key"
                                value={openaiKey}
                                onChange={(e: {
                                    target: { value: SetStateAction<string> }
                                }) => setOpenaiKey(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="youtube-data-api-key">YouTube Data API Key</Label>
                            <Input
                                id="youtube-data-api-key"
                                placeholder="Enter your YouTube Data API key"
                                value={youtubeDataApiKey}
                                onChange={(e: {
                                    target: { value: SetStateAction<string> }
                                }) => setYoutubeDataApiKey(e.target.value)}
                            />
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Save API Keys</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

