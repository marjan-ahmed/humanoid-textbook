import {useEffect} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {subscribeAuth, initAuth, getAuthUser, getAuthLoading, signOut} from '@site/src/lib/auth-store';

let _authInitialized = false;

function injectProfile(user: { name?: string; email?: string; softwareBackground?: string; hardwareBackground?: string; githubUsername?: string }) {
  const authItems = document.querySelectorAll('.navbar__auth-item');
  const navbarItems = document.querySelector('.navbar__items--right');
  if (!navbarItems) return;

  // Already injected?
  if (document.getElementById('navbar-auth-profile')) return;

  authItems.forEach((el) => (el as HTMLElement).style.display = 'none');

  const initial = (user.name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase();

  const wrapper = document.createElement('div');
  wrapper.id = 'navbar-auth-profile';
  wrapper.style.cssText = 'position:relative;display:flex;align-items:center;';

  wrapper.innerHTML = `
    <button id="nav-profile-btn" style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;padding:0.45rem 0.6rem;border:1px solid transparent;background:none;font-family:var(--ifm-font-family-monospace);font-size:0.74rem;font-weight:700;letter-spacing:0.06em;color:var(--nav-text);text-transform:uppercase;transition:all 0.18s ease;">
      <div style="background:var(--nav-copper);border-radius:50%;color:var(--nav-shell);display:flex;align-items:center;justify-content:center;width:26px;height:26px;font-family:var(--ifm-heading-font-family);font-size:0.7rem;font-weight:700;">${initial}</div>
      <span class="nav-profile-name" style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${user.name || user.email || 'User'}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div id="nav-profile-dropdown" style="display:none;background:var(--book-paper,#fbfaf7);border:1px solid var(--book-line,#ded8cd);box-shadow:0 12px 40px rgba(0,0,0,0.15);min-width:240px;position:absolute;right:0;top:calc(100% + 6px);z-index:100;border-radius:0;">
      <div style="border-bottom:1px solid var(--book-line,#ded8cd);display:flex;align-items:center;gap:0.75rem;padding:1rem;">
        <div style="background:var(--nav-copper);border-radius:50%;color:var(--nav-shell);display:flex;align-items:center;justify-content:center;width:36px;height:36px;font-family:var(--ifm-heading-font-family);font-size:1rem;font-weight:700;flex-shrink:0;">${initial}</div>
        <div style="min-width:0;">
          <div style="color:var(--book-ink,#161410);font-family:var(--ifm-heading-font-family);font-size:0.88rem;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${user.name || 'User'}</div>
          <div style="color:var(--book-muted,#5f5a52);font-family:var(--ifm-font-family-monospace);font-size:0.68rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${user.email}</div>
        </div>
      </div>
      ${user.softwareBackground ? `
      <div style="border-bottom:1px solid var(--book-line,#ded8cd);padding:0.75rem 1rem;">
        <span style="color:var(--book-muted,#5f5a52);display:block;font-family:var(--ifm-font-family-monospace);font-size:0.62rem;font-weight:700;letter-spacing:0.08em;margin-bottom:0.35rem;text-transform:uppercase;">Background</span>
        <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">
          <span style="background:rgba(138,100,41,0.1);border:1px solid rgba(138,100,41,0.3);color:var(--book-ink,#161410);font-family:var(--ifm-font-family-monospace);font-size:0.65rem;padding:0.2rem 0.5rem;">Software: ${user.softwareBackground}</span>
          ${user.hardwareBackground ? `<span style="background:rgba(138,100,41,0.1);border:1px solid rgba(138,100,41,0.3);color:var(--book-ink,#161410);font-family:var(--ifm-font-family-monospace);font-size:0.65rem;padding:0.2rem 0.5rem;">Hardware: ${user.hardwareBackground}</span>` : ''}
        </div>
      </div>` : ''}
      ${user.githubUsername ? `
      <div style="border-bottom:1px solid var(--book-line,#ded8cd);padding:0.75rem 1rem;">
        <a href="https://github.com/${user.githubUsername}" target="_blank" rel="noopener noreferrer" style="color:var(--book-ink,#161410);display:flex;font-family:var(--ifm-font-family-monospace);font-size:0.72rem;font-weight:700;gap:0.4rem;text-decoration:none;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          @${user.githubUsername}
        </a>
      </div>` : ''}
      <button id="nav-signout-btn" style="background:none;border:none;color:var(--book-muted,#5f5a52);cursor:pointer;display:block;font-family:var(--ifm-font-family-monospace);font-size:0.72rem;font-weight:700;letter-spacing:0.06em;padding:0.75rem 1rem;text-align:left;text-transform:uppercase;width:100%;">
        Sign Out
      </button>
    </div>
  `;

  const sourceLink = navbarItems.querySelector('a[href*="github.com"]');
  if (sourceLink) {
    navbarItems.insertBefore(wrapper, sourceLink);
  } else {
    navbarItems.appendChild(wrapper);
  }

  const btn = document.getElementById('nav-profile-btn');
  const dd = document.getElementById('nav-profile-dropdown');
  const signoutBtn = document.getElementById('nav-signout-btn');

  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
  });
  document.addEventListener('click', () => {
    if (dd) dd.style.display = 'none';
  });
  signoutBtn?.addEventListener('click', async () => {
    await signOut();
    window.location.href = '/humanoid-textbook/signin';
  });
}

function removeProfile() {
  const authItems = document.querySelectorAll('.navbar__auth-item');
  authItems.forEach((el) => (el as HTMLElement).style.display = '');
  const old = document.getElementById('navbar-auth-profile');
  if (old) old.remove();
}

function NavbarAuthInner() {
  useEffect(() => {
    if (!_authInitialized) {
      _authInitialized = true;
      initAuth();
    }

    const update = () => {
      const user = getAuthUser();
      if (user) {
        injectProfile(user);
      } else if (!getAuthLoading()) {
        removeProfile();
      }
    };

    // Run immediately (module-level state is already resolved from first load)
    update();

    const unsub = subscribeAuth(update);

    // MutationObserver: re-inject if navbar re-renders and removes our profile
    const observer = new MutationObserver(() => {
      const user = getAuthUser();
      if (user && !document.getElementById('navbar-auth-profile')) {
        const navbarItems = document.querySelector('.navbar__items--right');
        if (navbarItems) injectProfile(user);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      unsub();
      observer.disconnect();
    };
  }, []);

  return null;
}

export default function NavbarAuth() {
  return (
    <BrowserOnly fallback={null}>
      {() => <NavbarAuthInner />}
    </BrowserOnly>
  );
}
