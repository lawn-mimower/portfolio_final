export type Theme = 'system' | 'light' | 'dark';
export const STORE_KEY = 'mm-theme';

export function resolveStored(): Theme | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw === 'light' || raw === 'dark' ? raw : null;
  } catch {
    return null;
  }
}

export function computeNext(current: Theme): Theme {
  if (current === 'system') return 'light';
  if (current === 'light') return 'dark';
  return 'system';
}

export function applyTheme(t: Theme): void {
  const root = document.documentElement;
  if (t === 'system') {
    root.removeAttribute('data-theme');
    try { localStorage.removeItem(STORE_KEY); } catch {}
    return;
  }
  root.setAttribute('data-theme', t);
  try { localStorage.setItem(STORE_KEY, t); } catch {}
}

export function currentTheme(): Theme {
  const a = document.documentElement.getAttribute('data-theme');
  if (a === 'light' || a === 'dark') return a;
  return 'system';
}

/** Wrap a callback in startViewTransition if available, else call directly. */
export function withViewTransition(cb: () => void): void {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (typeof doc.startViewTransition === 'function') {
    doc.startViewTransition(cb);
  } else {
    cb();
  }
}
