import React, { useState, useCallback } from "react";
import { useAuthContext } from "../Auth/AuthContext";
import { usePersonalization } from "./PersonalizationContext";
import styles from "./TranslateButton.module.css";

interface TranslateButtonProps {
  chapterSlug: string;
  onTranslated?: (content: string, language?: string) => void;
  onOriginal?: () => void;
}

export default function TranslateButton({ chapterSlug, onTranslated, onOriginal }: TranslateButtonProps) {
  const { isAuthenticated } = useAuthContext();
  const { preferences, updatePreferences } = usePersonalization();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);

  const handleTranslate = useCallback(async (language: "ur" | "roman_ur") => {
    if (!isAuthenticated) return;
    setLoading(true);
    setShowMenu(false);

    try {
      const { api } = await import("../../lib/api");

      // Try cache first
      try {
        const cached = await api.getTranslationCache(chapterSlug, language);
        setActiveLanguage(language);
        await updatePreferences({ preferredTranslation: language });
        onTranslated?.(cached.translatedContent, language);
        return;
      } catch {
        // Cache miss, need to translate
      }

      const result = await api.translate(chapterSlug, language);

      setActiveLanguage(language);
      await updatePreferences({ preferredTranslation: language });
      onTranslated?.(result.translatedContent, language);
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setLoading(false);
    }
  }, [chapterSlug, isAuthenticated, onTranslated, updatePreferences]);

  const handleOriginal = useCallback(async () => {
    setActiveLanguage(null);
    await updatePreferences({ preferredTranslation: null });
    onOriginal?.();
  }, [onOriginal, updatePreferences]);

  if (!isAuthenticated) return null;

  return (
    <div className={styles.container}>
      {activeLanguage ? (
        <button
          className={`${styles.button} ${styles.active}`}
          onClick={handleOriginal}
          disabled={loading}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 1l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 23l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
          Show Original
        </button>
      ) : (
        <div className={styles.dropdownWrapper}>
          <button
            className={styles.button}
            onClick={() => setShowMenu(!showMenu)}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            )}
            {loading ? "Translating..." : "Translate"}
          </button>
          {showMenu && (
            <div className={styles.menu}>
              <button className={styles.menuItem} onClick={() => handleTranslate("ur")}>
                Urdu (اردو)
              </button>
              <button className={styles.menuItem} onClick={() => handleTranslate("roman_ur")}>
                Roman Urdu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
