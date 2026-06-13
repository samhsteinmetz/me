/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Backend base URL (the Express app under /server). Vite-native equivalent
  // of the brief's REACT_APP_API_URL.
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
