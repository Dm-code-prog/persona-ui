import { useQuery } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";
import { fetchWithAuth } from "@/auth";
export type GetProjectTasksResponseItem = {
    id: string;             // uuid
    tool_name: string;
    status: string;
    error_message: string | null;
    json_params: string | null;
    created_at: string;     // date-time
    updated_at: string;     // date-time
};

export type GetProjectTasksResponse = GetProjectTasksResponseItem[];

export const useGetProjectTasksQuery = (project_id: string) => {
    return useQuery({
        queryKey: ["GetProjectTasks", project_id],
        queryFn: async (): Promise<GetProjectTasksResponse> => {
            const url = `${AppConfig.backend_url}/api/projects/${project_id}/tasks`;
            const response = await fetchWithAuth(url);
            if (!response.ok) {
                throw new Error("Failed to fetch project tasks");
            }
            return (await response.json()) as GetProjectTasksResponse;
        },
        enabled: Boolean(project_id),
        refetchInterval: 5000,
    });
};