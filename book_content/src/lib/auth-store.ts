// Module-level auth state — works outside React context (navbar, etc.)

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  softwareBackground?: string;
  hardwareBackground?: string;
  githubUsername?: string;
}

type Listener = () => void;

const AUTH_SERVER = "http://localhost:3001";
const TOKEN_KEY = "better-auth.token";

let _user: User | null = null;
let _isLoading = true;
const _listeners = new Set<Listener>();

function notify() {
  _listeners.forEach((fn) => fn());
}

function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

function setToken(token: string) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
}

function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
}

export function getAuthUser(): User | null {
  return _user;
}

export function getAuthLoading(): boolean {
  return _isLoading;
}

export function subscribeAuth(listener: Listener): () => void {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

export async function signIn(email: string, password: string): Promise<void> {
  const res = await fetch(`${AUTH_SERVER}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error?.message || "Sign in failed");

  // Store the session token from the response
  if (data.token) {
    setToken(data.token);
  }

  // Set user from response
  if (data.user) {
    _user = data.user as User;
    _isLoading = false;
    notify();
  }
}

export async function signUp(name: string, email: string, password: string): Promise<void> {
  const res = await fetch(`${AUTH_SERVER}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password, callbackURL: "/" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error?.message || "Sign up failed");
}

export async function initAuth() {
  const token = getToken();
  if (!token) {
    _user = null;
    _isLoading = false;
    notify();
    return;
  }

  try {
    const res = await fetch(`${AUTH_SERVER}/api/auth/session`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data?.user) {
      _user = data.user as User;
    } else {
      _user = null;
      clearToken();
    }
  } catch {
    _user = null;
  } finally {
    _isLoading = false;
    notify();
  }
}

export async function signOut() {
  const token = getToken();
  try {
    await fetch(`${AUTH_SERVER}/api/auth/sign-out`, {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch {
    // ignore
  }
  clearToken();
  _user = null;
  notify();
}
