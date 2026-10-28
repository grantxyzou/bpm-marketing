'use client';

import { useEffect, useRef } from 'react';

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (mq.matches) v.pause();
      else void v.play().catch(() => {});
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <div className="relative w-full max-w-[250px] md:max-w-[300px] rounded-[44px] border border-[rgba(255,255,255,0.14)] bg-[#0b0b0b] p-[10px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
      <video
        ref={ref}
        className="block aspect-[390/844] w-full rounded-[34px] bg-[#100f0f] object-cover object-top"
        poster="/media/hero-poster.webp"
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label="A player opens BPM, taps Join, and appears numbered on the roster"
      >
        <source src="/media/hero-loop.webm" type="video/webm" />
        <source src="/media/hero-loop.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
