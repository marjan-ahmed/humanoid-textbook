import React, { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../Auth/AuthContext";
import styles from "./NotesPanel.module.css";

interface Note {
  id: string;
  section_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

interface NotesPanelProps {
  chapterSlug: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function NotesPanel({ chapterSlug, isOpen, onClose }: NotesPanelProps) {
  const { isAuthenticated } = useAuthContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);

  const loadNotes = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { api } = await import("../../lib/api");
      const data = await api.getNotes(chapterSlug);
      setNotes(data.notes || []);
    } catch (e) {
      console.error("Failed to load notes:", e);
    }
  }, [chapterSlug, isAuthenticated]);

  useEffect(() => {
    if (isOpen) loadNotes();
  }, [isOpen, loadNotes]);

  const addNote = useCallback(async () => {
    if (!newNote.trim() || !isAuthenticated) return;
    setLoading(true);
    try {
      const { api } = await import("../../lib/api");
      await api.addNote(chapterSlug, "", newNote.trim());
      setNewNote("");
      await loadNotes();
    } catch (e) {
      console.error("Failed to add note:", e);
    } finally {
      setLoading(false);
    }
  }, [chapterSlug, newNote, isAuthenticated, loadNotes]);

  const updateNote = useCallback(async (id: string) => {
    if (!editContent.trim()) return;
    setLoading(true);
    try {
      const { api } = await import("../../lib/api");
      await api.updateNote(id, editContent.trim());
      setEditingId(null);
      await loadNotes();
    } catch (e) {
      console.error("Failed to update note:", e);
    } finally {
      setLoading(false);
    }
  }, [editContent, loadNotes]);

  const deleteNote = useCallback(async (id: string) => {
    if (!confirm("Delete this note?")) return;
    try {
      const { api } = await import("../../lib/api");
      await api.deleteNote(id);
      await loadNotes();
    } catch (e) {
      console.error("Failed to delete note:", e);
    }
  }, [loadNotes]);

  if (!isAuthenticated || !isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>My Notes</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.addSection}>
          <textarea
            className={styles.textarea}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            rows={3}
          />
          <button
            className={styles.addBtn}
            onClick={addNote}
            disabled={!newNote.trim() || loading}
          >
            {loading ? "Saving..." : "Add Note"}
          </button>
        </div>

        <div className={styles.notesList}>
          {notes.length === 0 && (
            <p className={styles.empty}>No notes yet. Add one above.</p>
          )}
          {notes.map((note) => (
            <div key={note.id} className={styles.noteCard}>
              {editingId === note.id ? (
                <>
                  <textarea
                    className={styles.textarea}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                  />
                  <div className={styles.noteActions}>
                    <button className={styles.saveBtn} onClick={() => updateNote(note.id)} disabled={loading}>
                      Save
                    </button>
                    <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className={styles.noteContent}>{note.content}</p>
                  <div className={styles.noteMeta}>
                    <span className={styles.noteDate}>
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                    <div className={styles.noteActions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => { setEditingId(note.id); setEditContent(note.content); }}
                      >
                        Edit
                      </button>
                      <button className={styles.deleteBtn} onClick={() => deleteNote(note.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
