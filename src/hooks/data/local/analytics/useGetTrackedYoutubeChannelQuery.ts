import { useQuery } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";
import { fetchWithAuth } from "@/auth";
export type GetTrackedYoutubeChannelItem = {
    channel_id: string;
    channel_name: string;
    channel_url: string;
    created_at: string;
    updated_at: string;
    tag: string;
}

export type GetTrackedYoutubeChannelResponse = GetTrackedYoutubeChannelItem

export const useGetTrackedYoutubeChannelQuery = (channel_id: string) => {
    return useQuery({
        queryKey: ["GetTrackedYoutubeChannel", channel_id],
        queryFn: async (): Promise<GetTrackedYoutubeChannelResponse> => {
            const url = `${AppConfig.backend_url}/api/analytics/youtube_channel_tracker/${channel_id}`;
            const response = await fetchWithAuth(url);
            if (!response.ok) {
                throw new Error("Failed to fetch tracked YouTube channel");
            }
            return (await response.json()) as GetTrackedYoutubeChannelResponse;
        },
        enabled: Boolean(channel_id),
    });
};