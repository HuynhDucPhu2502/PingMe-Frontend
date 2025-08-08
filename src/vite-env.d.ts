/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_BACKEND_BASE_URL: string;
  };
}
