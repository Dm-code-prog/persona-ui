// useGetSecretInsecureQuery.ts
import { useQuery } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config.ts";


export type GetSecretInsecureResponse = {
    key: string;
    value: string;
}

export const useGetSecretInsecureQuery = (keyParam: string) => {
    return useQuery({
        queryKey: ["GetSecretInsecure", keyParam],
        queryFn: async (): Promise<GetSecretInsecureResponse> => {
            const url = new URL(`${AppConfig.backend_url}/api/secrets/get-insecure`);
            url.searchParams.append("key", keyParam);

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`Failed to get secret insecurely with key: ${keyParam}`);
            }

            return (await response.json()) as GetSecretInsecureResponse;
        },
        enabled: !!keyParam,
        retry: 0,
    });
};