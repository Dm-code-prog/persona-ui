import { useQuery } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";
import { fetchWithAuth } from "@/auth";

// Define the YouTube Analytics type
export interface YouTubeAnalytics {
    day: string;
    views: number;
    estimatedMinutesWatched: number;
    subscribersGained: number;
    likes: number;
    dislikes: number;
    averageViewDuration: number;
    averageViewPercentage: number;
}

// Helper function to transform the API response into an array of YouTubeAnalytics
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


export function useYouTubeChannelAnalytics(
    channelId: string,
    startDate: string,
    endDate: string
) {
    return useQuery<YouTubeAnalytics[], Error>({
        queryKey: ["backendYoutubeAnalytics", channelId, startDate, endDate],
        queryFn: async () => {
            // Construct the URL for your backend endpoint.
            const url = `${AppConfig.backend_url}/api/analytics/youtube_channel_tracker/${channelId}/analytics?startDate=${startDate}&endDate=${endDate}`;

            const response = await fetchWithAuth(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                // The backend returned an Unauthorized response due to missing/invalid tokens.
                throw new Error("Unauthorized: Please re-authorize the channel.");
            }

            if (!response.ok) {
                throw new Error("Failed to fetch analytics data");
            }

            const data = await response.json();
            return parseYouTubeAnalytics(data);
        },
        enabled: Boolean(channelId && startDate && endDate),
        retry: false,
    });
}