// useRunTop5PipelineMutation.ts
import {useMutation} from "@tanstack/react-query";
import {AppConfig} from "@/config/app-config";

export type RunTop5PipelineRequest = {
    pipelineId: string;
    background_video: string;
    background_music: string;
    video_effect: string;
    places_videos: string[];
    script: string;
    subtitle_color?: string; // default: "white"
    subtitle_highlight_color?: string; // default: "#7710e2"
    volume_adjustment?: number; // default: -25
};

// The OpenAPI spec shows an empty schema for the response, adjust as needed.
export type RunTop5PipelineResponse = Record<string, unknown>;

export const useRunTop5PipelineMutation = () => {
    return useMutation<RunTop5PipelineResponse, Error, RunTop5PipelineRequest>({
        mutationFn: async ({
                               pipelineId,
                               background_video,
                               background_music,
                               video_effect,
                               places_videos,
                               script,
                               subtitle_color,
                               subtitle_highlight_color,
                               volume_adjustment,
                           }) => {
            const response = await fetch(
                `${AppConfig.backend_url}/api/pipelines/top5/${pipelineId}/run`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        background_video,
                        background_music,
                        video_effect,
                        places_videos,
                        script,
                        subtitle_color,
                        subtitle_highlight_color,
                        volume_adjustment,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to run pipeline with ID: ${pipelineId}`);
            }

            return (await response.json()) as RunTop5PipelineResponse;
        },
    });
};