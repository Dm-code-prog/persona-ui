import { useMutation } from "@tanstack/react-query"
import { AppConfig } from "@/config/app-config"
import { queryClient } from "@/App"
import { fetchWithAuth } from "@/auth"
export type RunUnifierToolRequest = {
    video_name: string
    effect_name: string
    output_name: string
    blend_mode: string
    opacity: number
}

export type RunUnifierToolResponse = Record<string, unknown>

export const useRunUnifierToolMutation = (project_id: string) => {
    return useMutation<RunUnifierToolResponse, Error, RunUnifierToolRequest>({
        mutationFn: async ({...body}) => {
            const url = `${AppConfig.backend_url}/api/tools/video_unifier/${project_id}/run`;
            const response = await fetchWithAuth(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error("Failed to run unifier tool");
            }
            return (await response.json()) as RunUnifierToolResponse;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["GetProjectTasks", project_id]
            })
        }
    })
}
