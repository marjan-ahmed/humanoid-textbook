import React, { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../Auth/AuthContext";
import styles from "./BookmarkButton.module.css";

interface BookmarkButtonProps {
  chapterSlug: string;
  sectionId: string;
  sectionTitle: string;
}

export default function BookmarkButton({ chapterSlug, sectionId, sectionTitle }: BookmarkButtonProps) {
  const { isAuthenticated } = useAuthContext();
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    import("../../lib/api").then(({ api }) => {
      api.getBookmarks(chapterSlug).then((data) => {
        if (cancelled) return;
        const existing = data.bookmarks?.find((b: any) => b.section_id === sectionId);
        if (existing) {
          setBookmarked(true);
          setBookmarkId(existing.id);
        }
      }).catch(() => {});
    });

    return () => { cancelled = true; };
  }, [chapterSlug, sectionId, isAuthenticated]);

  const toggle = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const { api } = await import("../../lib/api");
      if (bookmarked && bookmarkId) {
        await api.deleteBookmark(bookmarkId);
        setBookmarked(false);
        setBookmarkId(null);
      } else {
        const result = await api.addBookmark(chapterSlug, sectionId, sectionTitle);
        setBookmarked(true);
        setBookmarkId(result.bookmark.id);
      }
    } catch (e) {
      console.error("Bookmark toggle failed:", e);
    }
  }, [isAuthenticated, bookmarked, bookmarkId, chapterSlug, sectionId, sectionTitle]);

  if (!isAuthenticated) return null;

  return (
    <button
      className={`${styles.button} ${bookmarked ? styles.active : ""}`}
      onClick={toggle}
      title={bookmarked ? "Remove bookmark" : "Add bookmark"}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
