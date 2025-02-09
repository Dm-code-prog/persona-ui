import { useMutation } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";
import { fetchWithAuth } from "@/auth";
import { useToast } from "@/hooks/use-toast";

export type InitiateYoutubeAuthRequest = {
    channel_id: string;
};

export type InitiateYoutubeAuthResponse = {
    authorization_url: string;
};

/**
 * This mutation hook initiates the Google OAuth flow.
 * It calls the backend endpoint which returns a 302 redirect URL.
 * On success the hook automatically redirects the user to the OAuth consent screen.
 */
export const useInitiateYoutubeAuthMutation = () => {
    const { toast } = useToast()

    return useMutation<InitiateYoutubeAuthResponse, Error, InitiateYoutubeAuthRequest>({
        mutationFn: async (payload: InitiateYoutubeAuthRequest) => {
            const url = `${AppConfig.backend_url}/api/analytics/youtube_channel_tracker/${payload.channel_id}/auth`;
            const response = await fetchWithAuth(url, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to initiate YouTube auth");
            }

            return response.json();
        },
        onSuccess: (data) => {
            // Automatically redirect the browser to the Google OAuth consent screen.
            window.location.href = data.authorization_url;
        },
        onError: (error) => {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to initiate YouTube auth",
            });
        },
    });
};