import { useMutation } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";

export type DeleteProjectFileRequest = {
    project_id: string;
    file_path: string;
};

export type DeleteProjectFileResponse = Record<string, unknown>;
// Schema is empty per the spec.

export const useDeleteProjectFileMutation = () => {
    return useMutation<DeleteProjectFileResponse, Error, DeleteProjectFileRequest>({
        mutationFn: async ({ project_id, file_path }) => {
            const qs = new URLSearchParams({ file_path });
            const url = `${AppConfig.backend_url}/api/projects/${project_id}/files/delete?${qs.toString()}`;

            const response = await fetch(url, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete project file");
            }
            return (await response.json()) as DeleteProjectFileResponse;
        },
    });
};