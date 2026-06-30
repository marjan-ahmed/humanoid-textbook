import React, { useState, useCallback, useRef } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useAuthContext } from "../Auth/AuthContext";
import TranslateButton from "./TranslateButton";
import ProgressBar from "./ProgressBar";
import BookmarkButton from "./BookmarkButton";
import NotesPanel from "./NotesPanel";
import styles from "./PersonalizationToolbar.module.css";

interface PersonalizationToolbarProps {
  chapterSlug: string;
}

function ToolbarInner({ chapterSlug }: PersonalizationToolbarProps) {
  const { isAuthenticated } = useAuthContext();
  const [notesOpen, setNotesOpen] = useState(false);
  const [translated, setTranslated] = useState(false);
  const originalHtml = useRef<string | null>(null);

  const handleTranslated = useCallback((content: string, language?: string) => {
    const article = document.querySelector("article");
    if (!article) return;
    if (!originalHtml.current) {
      originalHtml.current = article.innerHTML;
    }
    const isRtl = language === "ur";
    const mdContainer = article.querySelector(".markdown");
    if (mdContainer) {
      mdContainer.setAttribute("dir", isRtl ? "rtl" : "ltr");
      mdContainer.setAttribute("lang", isRtl ? "ur" : "en");
      mdContainer.style.textAlign = isRtl ? "right" : "left";
      mdContainer.style.direction = isRtl ? "rtl" : "ltr";
      mdContainer.innerHTML = content.replace(/\n/g, "<br/>");
    }
    setTranslated(true);
  }, []);

  const handleOriginal = useCallback(() => {
    if (originalHtml.current) {
      const article = document.querySelector("article");
      if (article) {
        const mdContainer = article.querySelector(".markdown");
        if (mdContainer) {
          mdContainer.removeAttribute("dir");
          mdContainer.removeAttribute("lang");
          mdContainer.style.textAlign = "";
          mdContainer.style.direction = "";
        }
        article.innerHTML = originalHtml.current;
      }
      originalHtml.current = null;
    }
    setTranslated(false);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.left}>
          <ProgressBar chapterSlug={chapterSlug} />
        </div>
        <div className={styles.right}>
          <BookmarkButton
            chapterSlug={chapterSlug}
            sectionId="_chapter_top"
            sectionTitle="Chapter Overview"
          />
          <button
            className={styles.notesBtn}
            onClick={() => setNotesOpen(true)}
            aria-label="Open notes"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Notes
          </button>
          <TranslateButton
            chapterSlug={chapterSlug}
            onTranslated={handleTranslated}
            onOriginal={handleOriginal}
          />
        </div>
      </div>
      <NotesPanel
        chapterSlug={chapterSlug}
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
      />
    </>
  );
}

export default function PersonalizationToolbar(props: PersonalizationToolbarProps) {
  return (
    <BrowserOnly fallback={<div className={styles.toolbar} />}>
      {() => <ToolbarInner {...props} />}
    </BrowserOnly>
  );
}
