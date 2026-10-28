'use client';

export function PromoVideo({ caption = 'BPM in about a minute: sign-ups, the waitlist, settling up, stringing, stats and organiser tools.' }: { caption?: string }) {
  return (
    <figure className="mx-auto w-full max-w-[960px]">
      <div className="glass overflow-hidden p-1.5">
        <video
          className="block aspect-video w-full rounded-[12px] bg-[#100f0f]"
          controls
          preload="none"
          playsInline
          poster="/media/promo-poster.webp"
        >
          <source src="/media/promo.mp4" type="video/mp4" />
        </video>
      </div>
      <figcaption className="mt-3 text-center text-sm text-text-3">{caption}</figcaption>
    </figure>
  );
}
