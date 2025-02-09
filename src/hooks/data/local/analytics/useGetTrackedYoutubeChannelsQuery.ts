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

export type GetTrackedYoutubeChannelsResponse = GetTrackedYoutubeChannelItem[];

export const useGetTrackedYoutubeChannelsQuery = () => {
    return useQuery({
        queryKey: ["GetTrackedYoutubeChannels"],
        queryFn: async (): Promise<GetTrackedYoutubeChannelsResponse> => {
            const url = `${AppConfig.backend_url}/api/analytics/youtube_channel_tracker/list`;
            const response = await fetchWithAuth(url);
            if (!response.ok) {
                throw new Error("Failed to fetch tracked YouTube channels");
            }
            return (await response.json()) as GetTrackedYoutubeChannelsResponse;
        },
    });
};