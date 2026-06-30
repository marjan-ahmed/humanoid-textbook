import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useAuthContext } from "../Auth/AuthContext";

interface Preferences {
  theme: string;
  preferredTranslation: string | null;
}

interface PersonalizationContextType {
  preferences: Preferences;
  loading: boolean;
  updatePreferences: (data: Partial<Preferences>) => Promise<void>;
}

const PersonalizationContext = createContext<PersonalizationContextType>({
  preferences: { theme: "system", preferredTranslation: null },
  loading: true,
  updatePreferences: async () => {},
});

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [preferences, setPreferences] = useState<Preferences>({
    theme: "system",
    preferredTranslation: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    import("../../lib/api").then(({ api }) => {
      api.getPreferences().then((data) => {
        if (cancelled) return;
        setPreferences(data.preferences || { theme: "system", preferredTranslation: null });
        setLoading(false);
      }).catch(() => {
        if (!cancelled) setLoading(false);
      });
    });

    return () => { cancelled = true; };
  }, [isAuthenticated, authLoading]);

  const updatePreferences = useCallback(async (data: Partial<Preferences>) => {
    const { api } = await import("../../lib/api");
    const result = await api.updatePreferences(data);
    setPreferences(result.preferences);
  }, []);

  return (
    <PersonalizationContext.Provider value={{ preferences, loading, updatePreferences }}>
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  return useContext(PersonalizationContext);
}

export default PersonalizationContext;
