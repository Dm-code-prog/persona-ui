import { useQuery } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";

export type DownloadFileResponse = Record<string, unknown>;
// Adjust if you expect binary data. For binary, you'd likely do:
//   const blob = await response.blob();
//   return URL.createObjectURL(blob);

type UseDownloadFileQueryParams = {
    project_id: string;
    file_name: string;
    file_type: string;
};

export const useDownloadFileQuery = ({ project_id, file_name, file_type }: UseDownloadFileQueryParams) => {
    return useQuery({
        queryKey: ["DownloadFile", project_id, file_name, file_type],
        queryFn: async (): Promise<DownloadFileResponse> => {
            const qs = new URLSearchParams({ file_name, file_type });
            const url = `${AppConfig.backend_url}/api/projects/${project_id}/files/download?${qs.toString()}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to download file");
            }
            return (await response.json()) as DownloadFileResponse;
        },
        enabled: Boolean(project_id && file_name && file_type),
        retry: 0,
    });
};