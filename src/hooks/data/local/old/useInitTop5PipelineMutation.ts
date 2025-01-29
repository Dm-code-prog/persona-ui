// useInitTop5PipelineMutation.ts
import { useMutation } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config.ts";

export type InitTop5PipelineRequest = {
    name: string;
};

export type InitTop5PipelineResponse = {
    id: string;
    status: string;
};

export const useInitTop5PipelineMutation = () => {
    return useMutation<InitTop5PipelineResponse, Error, InitTop5PipelineRequest>({
        mutationFn: async (payload: InitTop5PipelineRequest) => {
            const response = await fetch(`${AppConfig.backend_url}/api/pipelines/top5/init`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error("Failed to initialize top 5 pipeline");
            }
            return (await response.json()) as InitTop5PipelineResponse;
        },
    });
};