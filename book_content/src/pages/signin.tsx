import React, { useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './auth.module.css';

function getAuthServer(): string {
  if (typeof window === "undefined") return "http://localhost:3001";
  if (window.location.hostname === "localhost") return "http://localhost:3001";
  return "https://humanoid-textbook.up.railway.app";
}

function SigninForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${AUTH_SERVER}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error?.message || 'Sign in failed');
      }
      // Store token for cross-origin auth
      if (data.token) {
        try { localStorage.setItem('better-auth.token', data.token); } catch {}
      }
      window.location.href = '/humanoid-textbook/';
    } catch (err: any) {
      setError(err?.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authCard}>
      <p className={styles.authKicker}>Access</p>
      <h1 className={styles.authTitle}>Sign In</h1>
      <p className={styles.authSubtitle}>Access your learning dashboard</p>

      {error && <div className={styles.authError}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="email">Email</label>
          <input
            id="email"
            className={styles.formInput}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="password">Password</label>
          <input
            id="password"
            className={styles.formInput}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
            required
          />
        </div>

        <button
          type="submit"
          className={styles.authSubmit}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className={styles.authFooter}>
        Don't have an account? <a href="/humanoid-textbook/signup">Create One</a>
      </p>
      <p className={styles.authNote}>Free &middot; No credit card required</p>
    </div>
  );
}

function FallbackCard() {
  return (
    <div className={styles.authCard}>
      <p className={styles.authKicker}>Access</p>
      <h1 className={styles.authTitle}>Sign In</h1>
      <p className={styles.authSubtitle}>Loading...</p>
    </div>
  );
}

export default function Signin(): React.JSX.Element {
  return (
    <Layout title="Sign In" description="Sign in to your Physical AI account">
      <main className={styles.authPage}>
        <BrowserOnly fallback={<FallbackCard />}>
          {() => <SigninForm />}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
