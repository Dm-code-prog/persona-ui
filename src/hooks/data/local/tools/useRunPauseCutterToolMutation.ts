import {useMutation} from "@tanstack/react-query";
import {AppConfig} from "@/config/app-config";
import {queryClient} from "@/App.tsx";

export type RunPauseCutterToolRequest = {
    project_id: string;
    pause_threshold?: number; // default 0.5
    pause_padding?: number;   // default 0.1
    whisper_model?: string;   // default "small"
    video_name: string;
};

export type RunPauseCutterToolResponse = Record<string, unknown>;
// Spec shows an empty object.

export const useRunPauseCutterToolMutation = (project_id: string) => {
    return useMutation<RunPauseCutterToolResponse, Error, RunPauseCutterToolRequest>({
        mutationFn: async ({...body}) => {
            const url = `${AppConfig.backend_url}/api/tools/pause_cutter/${project_id}/run`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error("Failed to run pause cutter tool");
            }
            return (await response.json()) as RunPauseCutterToolResponse;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["GetProjectTasks", project_id]
            })
        }
    });
};