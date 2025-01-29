// useDownloadTop5PipelineFileQuery.ts
import { useQuery } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config.ts";

// The OpenAPI spec shows an empty schema for the response.
// If it actually returns file data, you might need to handle Blob instead.
export type DownloadTop5PipelineFileResponse = Record<string, unknown>;

export const useDownloadTop5PipelineFileQuery = (
    pipelineId: string,
    file_path: string
) => {
    return useQuery({
        queryKey: ["DownloadTop5PipelineFile", pipelineId, file_path],
        queryFn: async (): Promise<DownloadTop5PipelineFileResponse> => {
            const url = new URL(
                `${AppConfig.backend_url}/api/pipelines/top5/${pipelineId}/file`
            );
            url.searchParams.append("file_path", file_path);

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(
                    `Failed to download file "${file_path}" for pipeline ID: ${pipelineId}`
                );
            }

            return (await response.json()) as DownloadTop5PipelineFileResponse;
        },
        enabled: !!pipelineId && !!file_path,
    });
};