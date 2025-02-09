import { useMutation } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";
import { queryClient } from "@/App";
import { fetchWithAuth } from "@/auth";
export type CreateTrackedYoutubeChannelRequest = {
    channel_url: string;
    tag: string;
};

export type CreateTrackedYoutubeChannelResponse = Record<string, unknown>;

export const useCreateTrackedYoutubeChannelMutation = () => {
    return useMutation<CreateTrackedYoutubeChannelResponse, Error, CreateTrackedYoutubeChannelRequest>({
        mutationFn: async (payload: CreateTrackedYoutubeChannelRequest) => {

            const url = `${AppConfig.backend_url}/api/analytics/youtube_channel_tracker/`;

            const response = await fetchWithAuth(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error("Failed to create tracked YouTube channel");
            }
            return (await response.json()) as CreateTrackedYoutubeChannelResponse;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetTrackedYoutubeChannels"] })
        },
    });
};