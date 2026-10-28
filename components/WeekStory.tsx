'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { WEEK } from '@/content/en';

const FRAME =
  'relative w-full rounded-[44px] border border-[rgba(255,255,255,0.14)] bg-[#0b0b0b] p-[10px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]';

type Step = (typeof WEEK)[number];
const captionOf = (s: Step) => ('caption' in s ? s.caption : undefined);

/** One app screen that, while playing, eases in on the part of the screen the step is about and pulses a tap marker there. */
function Screen({ step, playing, sizes, alt, className = '' }: { step: Step; playing: boolean; sizes: string; alt: string; className?: string }) {
  const vars = {
    '--fx': `${step.focus[0]}%`,
    '--fy': `${step.focus[1]}%`,
    '--tx': `${step.tap[0]}%`,
    '--ty': `${step.tap[1]}%`,
  } as React.CSSProperties;
  return (
    <div className={`screen-anim ${playing ? 'is-playing' : ''} ${className}`} style={vars} aria-hidden={alt ? undefined : true}>
      <Image src={step.screen} alt={alt} fill sizes={sizes} className="object-cover object-top" />
      <span className="tap-ring" aria-hidden="true" />
    </div>
  );
}

export function WeekStory() {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    steps.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="week-story mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:gap-12">
      <ol className="flex flex-col gap-6 md:gap-0 md:py-[25vh]">
        {WEEK.map((s, i) => (
          <li
            key={s.step}
            ref={(el) => {
              steps.current[i] = el;
            }}
            data-index={i}
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
                  <Screen step={s} playing={i === active} sizes="260px" alt={s.alt} />
                </div>
              </div>
              {captionOf(s) && <figcaption className="text-sm text-text-3">{captionOf(s)}</figcaption>}
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
                  <Screen
                    key={s.screen}
                    step={s}
                    playing={i === active}
                    sizes="360px"
                    alt={i === active ? s.alt : ''}
                    className={`week-shot ${i === active ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
              </div>
            </div>
            <figcaption className="h-5 text-sm text-text-3" aria-live="polite">
              {captionOf(WEEK[active]) ?? ''}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
