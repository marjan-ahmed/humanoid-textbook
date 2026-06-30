import React, { useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './auth.module.css';

function getAuthServer(): string {
  if (typeof window === "undefined") return "http://localhost:3001";
  if (window.location.hostname === "localhost") return "http://localhost:3001";
  return "https://humanoid-textbook.up.railway.app";
}

function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [softwareBg, setSoftwareBg] = useState('beginner');
  const [hardwareBg, setHardwareBg] = useState('none');
  const [githubUsername, setGithubUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${getAuthServer()}/api/auth/sign-up/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password,
          callbackURL: '/',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error?.message || 'Signup failed');
      }
      window.location.href = '/humanoid-textbook/signin';
    } catch (err: any) {
      setError(err?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authCard}>
      <p className={styles.authKicker}>Account</p>
      <h1 className={styles.authTitle}>Create Account</h1>
      <p className={styles.authSubtitle}>Join the Physical AI community</p>

      {error && <div className={styles.authError}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="name">Full Name</label>
          <input
            id="name"
            className={styles.formInput}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

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
            placeholder="Min 8 characters"
            minLength={8}
            required
          />
        </div>

        <hr className={styles.authDivider} />

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="software">Software Background</label>
          <select
            id="software"
            className={styles.formSelect}
            value={softwareBg}
            onChange={e => setSoftwareBg(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="hardware">Hardware Background</label>
          <select
            id="hardware"
            className={styles.formSelect}
            value={hardwareBg}
            onChange={e => setHardwareBg(e.target.value)}
          >
            <option value="none">None</option>
            <option value="basic">Basic</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="github">GitHub Username</label>
          <input
            id="github"
            className={styles.formInput}
            type="text"
            value={githubUsername}
            onChange={e => setGithubUsername(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <button
          type="submit"
          className={styles.authSubmit}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className={styles.authFooter}>
        Already have an account? <a href="/humanoid-textbook/signin">Sign In</a>
      </p>
      <p className={styles.authNote}>Free &middot; No credit card required</p>
    </div>
  );
}

function FallbackCard() {
  return (
    <div className={styles.authCard}>
      <p className={styles.authKicker}>Account</p>
      <h1 className={styles.authTitle}>Create Account</h1>
      <p className={styles.authSubtitle}>Loading...</p>
    </div>
  );
}

export default function Signup(): React.JSX.Element {
  return (
    <Layout title="Sign Up" description="Create your Physical AI account">
      <main className={styles.authPage}>
        <BrowserOnly fallback={<FallbackCard />}>
          {() => <SignupForm />}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
