'use client';

import { ViewTransition } from 'react';

const FADE = { page: 'page-fade', default: 'none' };

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={FADE} exit={FADE} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
