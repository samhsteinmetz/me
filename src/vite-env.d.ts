/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Backend base URL (the Express app under /server). Vite-native equivalent
  // of the brief's REACT_APP_API_URL.
  readonly VITE_API_URL?: string;
  // Firebase Web SDK config (maps to the brief's REACT_APP_FIREBASE_* names).
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
