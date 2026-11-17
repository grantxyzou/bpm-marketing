'use client';

/**
 * A tap-to-play video in a glass frame. Defaults to the minute-long promo (silent);
 * the 20-second cuts (`/media/*-20s.mp4`) carry a soundtrack, which plays only when
 * someone presses play.
 */
export function PromoVideo({
  src = '/media/promo.mp4',
  poster = '/media/promo-poster.webp',
  caption = 'BPM in about a minute: sign-ups, the waitlist, settling up, stringing, stats and organiser tools.',
  label,
  className = 'max-w-[960px]',
}: {
  src?: string;
  poster?: string;
  caption?: string;
  /** Accessible name for the video, when the caption alone doesn't say what it is. */
  label?: string;
  className?: string;
}) {
  return (
    <figure className={`mx-auto w-full ${className}`}>
      <div className="glass overflow-hidden p-1.5">
        <video
          className="block aspect-video w-full rounded-[12px] bg-[#100f0f]"
          controls
          preload="none"
          playsInline
          poster={poster}
          aria-label={label}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <figcaption className="mt-3 text-center text-sm text-text-3">{caption}</figcaption>
    </figure>
  );
}
