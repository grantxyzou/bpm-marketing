'use client';

import { useEffect } from 'react';

/** Opens the <details> named by the URL hash, so links like /faq#price land on an expanded answer. */
export function OpenHashedDetails() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (el instanceof HTMLDetailsElement) el.open = true;
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);
  return null;
}
