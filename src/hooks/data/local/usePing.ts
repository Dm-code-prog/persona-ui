import {AppConfig} from "@/config/app-config.ts";
import {useQuery} from "@tanstack/react-query";
import { fetchWithAuth } from "@/auth";

export function usePing() {
    const {error} = useQuery({
        queryKey: ["local-backend-status"],
        queryFn: async () => {
            await fetchWithAuth(`${AppConfig.backend_url}/ping`);
            return true
        },
        retry: false,
    })

    return !error
}

