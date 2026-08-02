/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL_API: string;
  readonly VITE_APP_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
