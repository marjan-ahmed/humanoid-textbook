const AUTH_SERVER = "http://localhost:3001";

function getToken(): string | null {
  try { return localStorage.getItem("better-auth.token"); } catch { return null; }
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${AUTH_SERVER}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getTranslationCache: (chapterSlug: string, language: string) =>
    request(`/api/translate/cache?chapterSlug=${encodeURIComponent(chapterSlug)}&language=${language}`),

  translate: (chapterSlug: string, language: string) =>
    request("/api/translate", {
      method: "POST",
      body: JSON.stringify({ chapterSlug, language }),
    }),

  getProgress: (chapterSlug?: string) =>
    request(`/api/progress${chapterSlug ? `?chapterSlug=${encodeURIComponent(chapterSlug)}` : ""}`),

  updateProgress: (chapterSlug: string, data: { sectionsCompleted?: string[]; scrollPercent?: number; completed?: boolean }) =>
    request("/api/progress", {
      method: "POST",
      body: JSON.stringify({ chapterSlug, ...data }),
    }),

  getBookmarks: (chapterSlug?: string) =>
    request(`/api/bookmarks${chapterSlug ? `?chapterSlug=${encodeURIComponent(chapterSlug)}` : ""}`),

  addBookmark: (chapterSlug: string, sectionId: string, sectionTitle: string) =>
    request("/api/bookmarks", {
      method: "POST",
      body: JSON.stringify({ chapterSlug, sectionId, sectionTitle }),
    }),

  deleteBookmark: (id: string) =>
    request(`/api/bookmarks/${id}`, { method: "DELETE" }),

  getNotes: (chapterSlug: string) =>
    request(`/api/notes?chapterSlug=${encodeURIComponent(chapterSlug)}`),

  addNote: (chapterSlug: string, sectionId: string, content: string) =>
    request("/api/notes", {
      method: "POST",
      body: JSON.stringify({ chapterSlug, sectionId, content }),
    }),

  updateNote: (id: string, content: string) =>
    request(`/api/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    }),

  deleteNote: (id: string) =>
    request(`/api/notes/${id}`, { method: "DELETE" }),

  getPreferences: () => request("/api/preferences"),

  updatePreferences: (data: { theme?: string; preferredTranslation?: string }) =>
    request("/api/preferences", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
