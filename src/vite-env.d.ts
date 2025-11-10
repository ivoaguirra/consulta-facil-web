/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
    readonly VITE_SUPABASE_PROJECT_ID?: string;
    readonly VITE_SUPABASE_FUNCTIONS_URL?: string;
    readonly VITE_JITSI_BASE_URL?: string;
  }
}

export {};
