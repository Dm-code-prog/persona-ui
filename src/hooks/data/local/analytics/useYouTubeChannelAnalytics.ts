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

export interface AggregateAnalyticsRequest {
    channels: { channel_id: string, channel_name: string }[]
    dateRange: number
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


/**
 * useAggregateAnalytics fetches analytics for multiple channels over a given date range,
 * then aggregates (sums) the numeric values for each matching day.
 */
export function useAggregateAnalytics({ channels, dateRange }: AggregateAnalyticsRequest) {
    const from = new Date()
    from.setDate(from.getDate() - dateRange)
    const to = new Date()

    const startDate = from.toISOString().split("T")[0]
    const endDate = to.toISOString().split("T")[0]

    // For a stable query key, sort the channel IDs.
    const channelIds = channels.map((channel) => channel.channel_id).sort();

    return useQuery<YouTubeAnalytics[], Error>({
        queryKey: ["aggregateAnalytics", channelIds, startDate, endDate],
        queryFn: async () => {
            // Fetch analytics for each channel concurrently.
            const analyticsResults = await Promise.all(
                channels.map(async (channel) => {
                    const url = `${AppConfig.backend_url}/api/analytics/youtube_channel_tracker/${channel.channel_id}/analytics?startDate=${startDate}&endDate=${endDate}`;

                    const response = await fetchWithAuth(url, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.status === 401) {
                        throw new Error(`Unauthorized: Please re-authorize the channel=${channel.channel_id}`);
                    }
                    if (!response.ok) {
                        throw new Error(`Failed to fetch analytics data for channel ${channel.channel_id}`);
                    }

                    const data = await response.json();
                    return parseYouTubeAnalytics(data);
                })
            );

            // Aggregate the analytics by day.
            // We use a map keyed by the "day" string and sum all numeric values.
            const aggregated: Record<string, YouTubeAnalytics> = {};

            analyticsResults.forEach((channelAnalytics) => {
                channelAnalytics.forEach((entry) => {
                    const day = entry.day;
                    if (!aggregated[day]) {
                        aggregated[day] = {
                            day,
                            views: 0,
                            estimatedMinutesWatched: 0,
                            subscribersGained: 0,
                            likes: 0,
                            dislikes: 0,
                            averageViewDuration: 0,
                            averageViewPercentage: 0,
                        };
                    }
                    aggregated[day].views += entry.views;
                    aggregated[day].estimatedMinutesWatched += entry.estimatedMinutesWatched;
                    aggregated[day].subscribersGained += entry.subscribersGained;
                    aggregated[day].likes += entry.likes;
                    aggregated[day].dislikes += entry.dislikes;
                    aggregated[day].averageViewDuration += entry.averageViewDuration;
                    aggregated[day].averageViewPercentage += entry.averageViewPercentage;
                });
            });

            // Convert the aggregated results to a sorted array by day.
            const aggregatedArray = Object.values(aggregated).sort((a, b) =>
                a.day.localeCompare(b.day)
            );
            return aggregatedArray;
        },
        enabled: Boolean(channels?.length && dateRange),
        retry: false,
    });
}