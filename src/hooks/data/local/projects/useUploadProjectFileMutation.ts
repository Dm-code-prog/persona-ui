import {useMutation} from "@tanstack/react-query";
import {AppConfig} from "@/config/app-config";
import {queryClient} from "@/App.tsx";

// According to spec: multipart/form-data with { file, file_type } required
export type UploadProjectFileRequest = {
    file: File;      // or Blob
    file_type: string;
};

export type UploadProjectFileResponse = Record<string, unknown>;
// The spec shows just an empty object ({}). Adjust if your backend returns something specific.

export const useUploadProjectFileMutation = (project_id: string) => {
    return useMutation<UploadProjectFileResponse, Error, UploadProjectFileRequest>({
        mutationFn: async ({file, file_type}) => {
            const url = `${AppConfig.backend_url}/api/projects/${project_id}/files/upload`;

            // Build form data
            const formData = new FormData();
            formData.append("file", file);
            formData.append("file_type", file_type);

            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Failed to upload project file");
            }
            return (await response.json()) as UploadProjectFileResponse;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["ListProjectFiles", project_id],
            })
        }
    });
};