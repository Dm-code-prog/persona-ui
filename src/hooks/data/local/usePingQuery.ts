import {AppConfig} from "@/config/app-config.ts";
import {useQuery} from "@tanstack/react-query";

export function usePingQuery() {
    const {error} = useQuery({
        queryKey: ["local-backend-status"],
        queryFn: async () => {
            await fetch(`${AppConfig.backend_url}/ping`);
            return true
        },
    })

    return !error
}

