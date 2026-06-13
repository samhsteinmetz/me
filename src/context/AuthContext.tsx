// AuthContext — Firebase Google OAuth for the vitals panel.
//
// The panel is fully readable when logged out; auth only gates the
// "Log coffee now" button. Firebase config comes from VITE_FIREBASE_* env
// vars (see src/lib/firebase.ts). If those are absent, `configured` is false
// and signIn() rejects — the panel simply hides the logging UI.
//
// Note on env vars: the project brief specifies REACT_APP_* names (Create
// React App). This site is built with Vite, where client env vars must be
// prefixed VITE_ and read via import.meta.env — so REACT_APP_FIREBASE_API_KEY
// maps to VITE_FIREBASE_API_KEY, etc. Same secrets, Vite-native names.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  auth,
  firebaseConfigured,
  signInWithGoogle,
  signOutCurrentUser,
} from "../lib/firebase";

interface AuthValue {
  user: User | null;
  loading: boolean;
  /** True when Firebase web config is present; false hides sign-in entirely. */
  configured: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue>({
  user: null,
  loading: firebaseConfigured,
  configured: firebaseConfigured,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Only "loading" while Firebase is actually initializing a session.
  const [loading, setLoading] = useState(firebaseConfigured);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const signIn = async () => {
    await signInWithGoogle();
  };

  const signOut = async () => {
    await signOutCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, configured: firebaseConfigured, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
