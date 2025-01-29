import {useQuery} from "@tanstack/react-query";
import {AppConfig} from "@/config/app-config.ts";

export type GetProjectsResponseItem = {
    id: string;
    name: string;
    created_at: string; // date-time
    updated_at: string; // date-time
}

export type GetProjectsResponse = GetProjectsResponseItem[];

export const useGetProjectsQuery = () => {
    return useQuery({
        queryKey: ["GetProjects"],
        queryFn: async (): Promise<GetProjectsResponse> => {
            const response = await fetch(`${AppConfig.backend_url}/api/projects/`);
            if (!response.ok) {
                throw new Error("Failed to fetch list of projects");
            }

            return (await response.json()) as GetProjectsResponse;
        },
    });
};