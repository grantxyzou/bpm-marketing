import { SITE } from '@/lib/site';

function AppleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.52c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.41 1.2-2.47-.03-.01-2.3-.88-2.3-3.52zM14.2 6.06c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22z" />
    </svg>
  );
}

function AndroidGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 00-.66-.38l-1.86 3.22a11.5 11.5 0 00-9.84 0L5.22 5.92a.38.38 0 10-.66.38L6.4 9.48A10.8 10.8 0 001 18h22a10.8 10.8 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
    </svg>
  );
}

export function GetTheApp({ compact = false, showNote = true }: { compact?: boolean; showNote?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <a className="btn btn-primary" href={SITE.testflight} rel="noopener">
          <AppleGlyph />
          {compact ? 'iPhone beta' : 'Get the iPhone beta'}
        </a>
        <a className="btn btn-ghost" href={SITE.playTest} rel="noopener">
          <AndroidGlyph />
          {compact ? 'Android beta' : 'Get the Android beta'}
        </a>
      </div>
      {showNote && (
        <p className="text-sm text-text-3">
          Free. iPhone joins through TestFlight. The Android beta is invite-only for now, so ask your organiser to add you.
          Or{' '}
          <a className="underline decoration-divider underline-offset-4 hover:text-text" href={SITE.appUrl}>
            open it in your browser
          </a>
          .
        </p>
      )}
    </div>
  );
}
