import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import {
  User,
  getAuthUser,
  getAuthLoading,
  subscribeAuth,
  initAuth,
  signOut as storeSignOut,
} from "../../lib/auth-store";

export type { User };

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getAuthUser());
  const [isLoading, setIsLoading] = useState(getAuthLoading());

  useEffect(() => {
    initAuth();
    const unsub = subscribeAuth(() => {
      setUser(getAuthUser());
      setIsLoading(getAuthLoading());
    });
    return unsub;
  }, []);

  const logout = useCallback(async () => {
    await storeSignOut();
    window.location.href = "/humanoid-textbook/signin";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export const useAuthContext = useAuth;

export default AuthContext;
