import { useQuery } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";
import { fetchWithAuth } from "@/auth";
// The spec states the response is an object with additionalProperties: string

export type ListProjectFilesResponse = Record<string, any>;

export const useListProjectFilesQuery = (project_id: string) => {
    return useQuery({
        queryKey: ["ListProjectFiles", project_id],
        queryFn: async (): Promise<ListProjectFilesResponse> => {
            const url = `${AppConfig.backend_url}/api/projects/${project_id}/files`;
            const response = await fetchWithAuth(url);
            if (!response.ok) {
                throw new Error("Failed to list project files");
            }
            return (await response.json()) as ListProjectFilesResponse;
        },
        enabled: Boolean(project_id),
        refetchInterval: 1000,
    });
};