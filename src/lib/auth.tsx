import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, firebaseConfigured } from "./firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  configured: boolean;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: !firebaseConfigured ? false : true,
  configured: firebaseConfigured,
  getIdToken: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(firebaseConfigured);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const getIdToken = useCallback(async () => {
    if (!user) return null;
    return user.getIdToken();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, loading, configured: firebaseConfigured, getIdToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
