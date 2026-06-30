import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuthContext } from "../Auth/AuthContext";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  chapterSlug: string;
}

export default function ProgressBar({ chapterSlug }: ProgressBarProps) {
  const { isAuthenticated } = useAuthContext();
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveProgress = useCallback(async (pct: number) => {
    if (!isAuthenticated) return;
    setSaving(true);
    try {
      const { api } = await import("../../lib/api");
      await api.updateProgress(chapterSlug, {
        scrollPercent: Math.round(pct),
        completed: pct >= 95,
      });
      if (pct >= 95) setCompleted(true);
    } catch (e) {
      console.error("Failed to save progress:", e);
    } finally {
      setSaving(false);
    }
  }, [chapterSlug, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Load saved progress
    let cancelled = false;
    import("../../lib/api").then(({ api }) => {
      api.getProgress(chapterSlug).then((data) => {
        if (cancelled) return;
        if (data.progress) {
          setProgress(data.progress.scroll_percent || 0);
          setCompleted(data.progress.completed || false);
        }
      }).catch(() => {});
    });

    return () => { cancelled = true; };
  }, [chapterSlug, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleScroll = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const total = rect.height - window.innerHeight;
      const pct = Math.min(100, (scrolled / total) * 100);

      setProgress(pct);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => saveProgress(pct), 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAuthenticated, saveProgress]);

  if (!isAuthenticated) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <div
          className={`${styles.fill} ${completed ? styles.completed : ""}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className={styles.label}>
        {completed ? "Completed" : saving ? "Saving..." : `${Math.round(progress)}%`}
      </span>
    </div>
  );
}
