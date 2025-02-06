import { useCallback, useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AppConfig } from "@/config/app-config"

interface YouTubeAnalytics {
    day: string;
    views: number;
    estimatedMinutesWatched: number;
    subscribersGained: number;
    likes: number;
    dislikes: number;
    averageViewDuration: number;
    averageViewPercentage: number;
}

function parseYouTubeAnalytics(response: any): YouTubeAnalytics[] {
    if (!response || !response.columnHeaders || !response.rows) {
        throw new Error("Invalid response format");
    }

    const keys = response.columnHeaders.map((header: { name: string }) => header.name);

    return response.rows.map((row: any[]) => {
        const entry: any = {};
        keys.forEach((key: string, index: number) => {
            entry[key] = row[index];
        });
        return entry as YouTubeAnalytics;
    });
}

const CLIENT_ID =
    "725009002466-u444qqub8k02ol4gpsbg1alfd2199224.apps.googleusercontent.com"
const SCOPE = "https://www.googleapis.com/auth/yt-analytics.readonly"

export function useYouTubeAnalytics(channelId: string, startDate?: string, endDate?: string) {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [isAuthorized, setIsAuthorized] = useState(false)

    // 1) Load token from storage
    useEffect(() => {
        const storedToken = localStorage.getItem(`youtube_access_token_${channelId}`)
        if (storedToken) {
            setAccessToken(storedToken)
            setIsAuthorized(true)
        }
    }, [channelId])

    // 2) Initiate OAuth
    const initiateOAuth = useCallback(() => {
        const redirectUri = `${AppConfig.front_end_url}/analytics/youtube-channels`
        const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")

        authUrl.searchParams.set("client_id", CLIENT_ID)
        authUrl.searchParams.set("redirect_uri", redirectUri)
        authUrl.searchParams.set("response_type", "token")
        authUrl.searchParams.set("scope", SCOPE)

        // Redirect to the Google OAuth page
        window.location.href = authUrl.toString()
    }, [])

    // 3) Check for token in URL after OAuth redirect
    useEffect(() => {
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        const token = params.get("access_token")

        if (token) {
            setAccessToken(token)
            setIsAuthorized(true)
            localStorage.setItem(`youtube_access_token_${channelId}`, token)

            // Clear the hash so token isn't visible in the URL
            window.history.replaceState({}, document.title, window.location.pathname)
        }
    }, [channelId])

    // 4) Fetch analytics (React Query)
    const fetchAnalytics = useCallback(async (): Promise<YouTubeAnalytics[]> => {
        if (!accessToken) {
            throw new Error("Not authorized")
        }

        if (!startDate || !endDate) {
            throw new Error("Missing start/end dates")
        }

        const url = new URL("https://youtubeanalytics.googleapis.com/v2/reports")
        url.searchParams.set("ids", `channel==${channelId}`)
        url.searchParams.set("startDate", startDate)
        url.searchParams.set("endDate", endDate)
        url.searchParams.set("dimensions", "day")
        url.searchParams.set("metrics", "views,estimatedMinutesWatched,subscribersGained,likes,dislikes,averageViewDuration,averageViewPercentage")
        url.searchParams.set("access_token", accessToken)

        const response = await fetch(url.toString())

        if (response.status === 401) {
            setIsAuthorized(false)
            localStorage.removeItem(`youtube_access_token_${channelId}`)
            throw new Error("Unauthorized")
        }

        if (!response.ok) {
            throw new Error("Failed to fetch analytics data")
        }

        const data = await response.json()
        return parseYouTubeAnalytics(data)
    }, [channelId, startDate, endDate, accessToken])

    // Use React Query's useQuery to fetch once authorized
    const query = useQuery({
        queryKey: ["youtubeAnalytics", channelId, startDate, endDate, accessToken],
        queryFn: fetchAnalytics,
        // Only fetch if we're authorized and have valid dates
        enabled: isAuthorized && !!startDate && !!endDate,
        retry: false
    })

    // 5) Return needed values (data, loading, error, plus OAuth helpers)
    return {
        isAuthorized,
        initiateOAuth,
        analyticsData: query.data,
        analyticsError: query.error,
        isLoadingAnalytics: query.isLoading,
        refetchAnalytics: query.refetch,
    }
}