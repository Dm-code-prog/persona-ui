export const AppConfig = {
    backend_url: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
    front_end_url: import.meta.env.VITE_FRONT_END_URL || "http://localhost:3000",
    supabase_url: import.meta.env.VITE_SUPABASE_URL || "https://cqnkvjocrayqyxgkuwjy.supabase.co",
    supabase_key: import.meta.env.VITE_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxbmt2am9jcmF5cXl4Z2t1d2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NTMxODIsImV4cCI6MjA1NDUyOTE4Mn0.t4eSVEE_c11-3hFJTftUn9igDAzxSknK4yZyrawWyFg",
} as const;