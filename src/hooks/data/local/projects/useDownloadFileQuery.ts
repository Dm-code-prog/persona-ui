import {useQuery} from "@tanstack/react-query";
import {AppConfig} from "@/config/app-config";
import { fetchWithAuth } from "@/auth";

type UseDownloadFileQueryParams = {
    project_id: string;
    file_path: string
};

export const useDownloadFileQuery = ({
                                         project_id,
                                         file_path
                                     }: UseDownloadFileQueryParams) => {
    return useQuery({
        queryKey: ["DownloadFile", project_id, file_path],
        queryFn: async (): Promise<string> => {
            const qs = new URLSearchParams({file_path});
            const url = `${AppConfig.backend_url}/api/projects/${project_id}/files/download?${qs.toString()}`;

            // fetch the binary response
            const response = await fetchWithAuth(url);
            if (!response.ok) {
                throw new Error("Failed to download file");
            }

            // convert to blob
            const blob = await response.blob();

            // create a local URL for that blob
            return URL.createObjectURL(blob);
        },
        enabled: Boolean(project_id && file_path),
    });
};