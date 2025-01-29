// getTop5PipelineQuery.ts
import { useQuery } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config.ts";

export type GetTop5PipelineResponse = {
    id: string;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
    script: string;
    subtitle_color: string;
    subtitle_highlight_color: string;
    volume_adjustment: number;
};

export const useGetTop5PipelineQuery = (pipelineId: string) => {
    return useQuery({
        queryKey: ["GetTop5Pipeline", pipelineId],
        queryFn: async (): Promise<GetTop5PipelineResponse> => {
            const response = await fetch(
                `${AppConfig.backend_url}/api/pipelines/top5/${pipelineId}`
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch top 5 pipeline with ID: ${pipelineId}`);
            }

            return (await response.json()) as GetTop5PipelineResponse;
        },
        enabled: !!pipelineId,
    });
};