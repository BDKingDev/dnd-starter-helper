/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_PATH?: string;
  readonly VITE_SUBMISSION_ENDPOINT?: string;
  readonly VITE_SUBMISSION_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
