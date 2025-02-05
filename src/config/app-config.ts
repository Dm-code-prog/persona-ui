export const AppConfig = {
    backend_url: "http://localhost:8000",
    front_end_url: import.meta.env.VITE_FRONT_END_URL || "http://localhost:3000",
} as const;