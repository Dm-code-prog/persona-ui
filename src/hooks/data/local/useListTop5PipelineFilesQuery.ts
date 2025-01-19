// useListTop5PipelineFilesQuery.ts
import {useQuery} from "@tanstack/react-query";
import {AppConfig} from "@/config/app-config";

// The OpenAPI spec shows an empty schema, so adjust as needed based on actual return data.
export type ListTop5PipelineFilesResponse = Record<string, unknown>;

export const useListTop5PipelineFilesQuery = (pipelineId: string) => {
    return useQuery({
        queryKey: ["ListTop5PipelineFiles", pipelineId],
        queryFn: async (): Promise<ListTop5PipelineFilesResponse> => {
            const response = await fetch(
                `${AppConfig.backend_url}/api/pipelines/top5/${pipelineId}/files`
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch files for pipeline ID: ${pipelineId}`);
            }

            return (await response.json()) as ListTop5PipelineFilesResponse;
        },
        enabled: !!pipelineId,
        retry: 0,
    });
};