import { supabase } from "./App";

export const getAuthToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || ''
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = await getAuthToken();

    const headers = new Headers(options.headers);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    return fetch(url, {
        ...options,
        headers,
    })
};