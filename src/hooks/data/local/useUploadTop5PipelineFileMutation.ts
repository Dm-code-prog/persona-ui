// useUploadTop5PipelineFileMutation.ts
import { useMutation } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";

export type UploadTop5PipelineFileRequest = {
    pipelineId: string;
    file: File;
    file_type: string;
};

export type UploadTop5PipelineFileResponse = Record<string, unknown>; // or an empty object if the backend returns {}

export const useUploadTop5PipelineFileMutation = () => {
    return useMutation<UploadTop5PipelineFileResponse, Error, UploadTop5PipelineFileRequest>({
        mutationFn: async ({ pipelineId, file, file_type }) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("file_type", file_type);

            const response = await fetch(
                `${AppConfig.backend_url}/api/pipelines/top5/${pipelineId}/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to upload file for pipeline ID: ${pipelineId}`);
            }

            return (await response.json()) as UploadTop5PipelineFileResponse;
        },
    });
};