import { useMutation } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";
import { fetchWithAuth } from "@/auth";
export type DeleteTrackedYoutubeChannelResponse = Record<string, unknown>;

export const useDeleteTrackedYoutubeChannelMutation = () => {
    return useMutation<DeleteTrackedYoutubeChannelResponse, Error, { channel_id: string }>({
        mutationFn: async ({ channel_id }) => {
            const url = `${AppConfig.backend_url}/api/analytics/youtube_channel_tracker/${channel_id}`;
            const response = await fetchWithAuth(url, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete tracked YouTube channel");
            }
            return (await response.json()) as DeleteTrackedYoutubeChannelResponse;
        },
    });
};