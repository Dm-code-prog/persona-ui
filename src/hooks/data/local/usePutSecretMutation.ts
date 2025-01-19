// usePutSecretMutation.ts
import { useMutation } from "@tanstack/react-query";
import { AppConfig } from "@/config/app-config";

export type PutSecretRequest = {
    key: string;
    value: string;
};

// The OpenAPI spec is empty for the response, adjust as needed.
export type PutSecretResponse = Record<string, unknown>;

export const usePutSecretMutation = () => {
    return useMutation<PutSecretResponse, Error, PutSecretRequest>({
        mutationFn: async ({ key, value }) => {
            const url = new URL(`${AppConfig.backend_url}/api/secrets/put`);
            url.searchParams.append("key", key);
            url.searchParams.append("value", value);

            const response = await fetch(url.toString(), {
                method: "PUT",
            });

            if (!response.ok) {
                throw new Error(`Failed to put secret with key: ${key}`);
            }

            return (await response.json()) as PutSecretResponse;
        },
    });
};