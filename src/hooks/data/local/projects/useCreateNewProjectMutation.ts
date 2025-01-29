import { useMutation } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";

export type CreateNewProjectRequest = {
    name: string;
};

export type CreateNewProjectResponse = {
    id: string;       // uuid
    name: string;
    created_at: string;  // date-time
    updated_at: string;  // date-time
};

export const useCreateNewProjectMutation = () => {
    return useMutation<CreateNewProjectResponse, Error, CreateNewProjectRequest>({
        mutationFn: async (payload: CreateNewProjectRequest) => {
            const response = await fetch(`${AppConfig.backend_url}/api/projects/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error("Failed to create new project");
            }
            return (await response.json()) as CreateNewProjectResponse;
        },
    });
};