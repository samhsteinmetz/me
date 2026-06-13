import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
} from "firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (firebaseConfigured) {
  app = initializeApp(config);
  auth = getAuth(app);
}

export { auth };

const provider = firebaseConfigured ? new GoogleAuthProvider() : null;

export async function signInWithGoogle() {
  if (!auth || !provider) {
    throw new Error("Firebase is not configured on the frontend.");
  }
  return signInWithPopup(auth, provider);
}

export async function signOutCurrentUser() {
  if (!auth) return;
  return signOut(auth);
}
