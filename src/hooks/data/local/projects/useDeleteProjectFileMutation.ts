import { useMutation } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";
import { queryClient } from "@/App";
import { fetchWithAuth } from "@/auth";
export type DeleteProjectFileRequest = {
    file_path: string;
};

export type DeleteProjectFileResponse = Record<string, unknown>;
// Schema is empty per the spec.

export const useDeleteProjectFileMutation = (project_id: string) => {
    return useMutation<DeleteProjectFileResponse, Error, DeleteProjectFileRequest>({
        mutationFn: async ({ file_path }) => {
            const qs = new URLSearchParams({ file_path });
            const url = `${AppConfig.backend_url}/api/projects/${project_id}/files/delete?${qs.toString()}`;

            const response = await fetchWithAuth(url, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete project file");
            }
            return (await response.json()) as DeleteProjectFileResponse;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ListProjectFiles", project_id] });
        },
    });
};