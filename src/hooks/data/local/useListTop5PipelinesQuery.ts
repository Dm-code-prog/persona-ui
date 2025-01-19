// useListTop5PipelinesQuery.ts
import { useQuery } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";

export type ListTop5PipelineItem = {
    id: string;
    name: string | null;
    status: string;
    created_at: string; // date-time
    updated_at: string; // date-time
};

export type ListTop5PipelinesResponse = ListTop5PipelineItem[];

export const useListTop5PipelinesQuery = () => {
    return useQuery({
        queryKey: ["ListTop5Pipelines"],
        queryFn: async (): Promise<ListTop5PipelinesResponse> => {
            const response = await fetch(`${AppConfig.backend_url}/api/pipelines/top5/`);
            if (!response.ok) {
                throw new Error("Failed to fetch list of top 5 pipelines");
            }

            return (await response.json()) as ListTop5PipelinesResponse;
        },
        retry: 0,
    });
};