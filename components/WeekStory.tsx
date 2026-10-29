'use client';

import { useEffect, useRef, useState } from 'react';
import { WEEK } from '@/content/en';

const FRAME =
  'relative w-full rounded-[44px] border border-[rgba(255,255,255,0.14)] bg-[#0b0b0b] p-[10px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]';

type Step = (typeof WEEK)[number];
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function seek(v: HTMLVideoElement | null, progress: number) {
  if (!v || !v.duration || Number.isNaN(v.duration)) return;
  // Stop just short of the end so the last frame stays decoded on every browser.
  const t = progress * Math.max(0, v.duration - 0.05);
  if (Math.abs(v.currentTime - t) > 0.01) v.currentTime = t;
}

function Clip({ step, videoRef, label }: { step: Step; videoRef: (el: HTMLVideoElement | null) => void; label?: string }) {
  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover object-top"
      poster={`${step.clip}-first.webp`}
      muted
      playsInline
      preload="none"
      tabIndex={-1}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <source src={`${step.clip}.mp4`} type="video/mp4" />
    </video>
  );
}

export function WeekStory() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const steps = useRef<(HTMLLIElement | null)[]>([]);
  const inline = useRef<(HTMLVideoElement | null)[]>([]);
  const stuck = useRef<(HTMLVideoElement | null)[]>([]);
  const activeRef = useRef(0);

  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const all = () => [...inline.current, ...stuck.current].filter(Boolean) as HTMLVideoElement[];

    if (reduce) {
      // No scrubbing: show each step's finished state.
      WEEK.forEach((s, i) => {
        [inline.current[i], stuck.current[i]].forEach((v) => v && (v.poster = `${s.clip}-last.webp`));
      });
    }

    let loaded = false;
    const loader = new IntersectionObserver(
      (entries) => {
        if (loaded || reduce || !entries.some((e) => e.isIntersecting)) return;
        loaded = true;
        all().forEach((v) => {
          v.preload = 'auto';
          v.load();
        });
        loader.disconnect();
      },
      { rootMargin: '100% 0px' },
    );
    loader.observe(rootEl);

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const desktop = window.matchMedia('(min-width: 768px)').matches;
      let current = activeRef.current;

      steps.current.forEach((li, i) => {
        if (!li) return;
        const r = li.getBoundingClientRect();
        if (r.top <= vh / 2 && r.bottom >= vh / 2) current = i;
        if (reduce) return;
        if (desktop) {
          // The step's card crossing the middle of the screen drives its clip from first frame to last.
          const p = clamp01((vh * 0.5 - r.top) / r.height);
          seek(stuck.current[i], p);
        } else {
          const fig = inline.current[i]?.closest('figure');
          if (!fig) return;
          const f = fig.getBoundingClientRect();
          seek(inline.current[i], clamp01((vh * 0.8 - f.top) / (f.height + vh * 0.4)));
        }
      });

      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    all().forEach((v) => v.addEventListener('loadedmetadata', onScroll));
    update();
    return () => {
      loader.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      all().forEach((v) => v.removeEventListener('loadedmetadata', onScroll));
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={root} className="week-story mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:gap-12">
      <ol className="flex flex-col gap-6 md:gap-0 md:py-[25vh]">
        {WEEK.map((s, i) => (
          <li
            key={s.step}
            ref={(el) => {
              steps.current[i] = el;
            }}
            className="flex flex-col gap-5 md:min-h-[60vh] md:items-end md:justify-center"
          >
            <div
              className={`glass flex flex-col gap-3 p-6 transition-[border-color,opacity] duration-300 md:w-full md:max-w-md md:p-8 ${
                i === active ? 'md:border-[color-mix(in_srgb,var(--accent)_55%,transparent)]' : 'md:opacity-55'
              }`}
              aria-current={i === active ? 'step' : undefined}
            >
              <span className="mono text-sm text-accent">{s.step}</span>
              <h3 className="text-xl font-semibold md:text-[1.75rem]">{s.title}</h3>
              <p className="text-[15px] text-text-2 md:text-[17px]">{s.body}</p>
            </div>
            {/* Phones under each step on small screens; the sticky phone takes over from md up. */}
            <figure className="flex flex-col items-center gap-2 md:hidden">
              <div className={`${FRAME} max-w-[260px]`}>
                <div className="relative aspect-[390/844] overflow-hidden rounded-[34px] bg-[#100f0f]">
                  <Clip
                    step={s}
                    label={s.alt}
                    videoRef={(el) => {
                      inline.current[i] = el;
                    }}
                  />
                </div>
              </div>
            </figure>
          </li>
        ))}
      </ol>
      <div className="hidden md:block">
        {/* Fills the viewport below the header so the phone is always vertically centred. */}
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center justify-start">
          <figure className="week-zoom flex flex-col items-center gap-3">
            <div className={FRAME} style={{ width: 'min(360px, calc((100vh - 9rem) * 0.462))' }}>
              <div className="relative aspect-[390/844] overflow-hidden rounded-[34px] bg-[#100f0f]">
                {WEEK.map((s, i) => (
                  <div key={s.clip} className={`week-shot absolute inset-0 ${i === active ? 'opacity-100' : 'opacity-0'}`}>
                    <Clip
                      step={s}
                      label={i === active ? s.alt : undefined}
                      videoRef={(el) => {
                        stuck.current[i] = el;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </figure>
        </div>
      </div>
    </div>
  );
}
