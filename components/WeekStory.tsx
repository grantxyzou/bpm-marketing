'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { WEEK } from '@/content/en';

const FRAME =
  'relative w-full max-w-[280px] rounded-[44px] border border-[rgba(255,255,255,0.14)] bg-[#0b0b0b] p-[10px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]';

type Step = (typeof WEEK)[number];
const captionOf = (s: Step) => ('caption' in s ? s.caption : undefined);

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
    <div className="grid gap-10 md:grid-cols-[1fr_minmax(0,320px)] md:gap-16">
      <ol className="flex flex-col gap-6 md:gap-0">
        {WEEK.map((s, i) => (
          <li
            key={s.step}
            ref={(el) => {
              steps.current[i] = el;
            }}
            data-index={i}
            className="flex flex-col gap-5 md:min-h-[70vh] md:justify-center"
          >
            <div
              className={`glass flex flex-col gap-3 p-6 transition-[border-color,opacity] duration-300 md:max-w-md ${
                i === active ? 'md:border-[color-mix(in_srgb,var(--accent)_55%,transparent)]' : 'md:opacity-55'
              }`}
              aria-current={i === active ? 'step' : undefined}
            >
              <span className="mono text-sm text-accent">{s.step}</span>
              <h3 className="text-xl font-semibold md:text-2xl">{s.title}</h3>
              <p className="text-[15px] text-text-2 md:text-base">{s.body}</p>
            </div>
            {/* Phones under each step on small screens; the sticky phone takes over from md up. */}
            <figure className="flex flex-col items-center gap-2 md:hidden">
              <div className={`${FRAME} max-w-[240px]`}>
                <div className="relative aspect-[390/844] overflow-hidden rounded-[34px] bg-[#100f0f]">
                  <Image src={s.screen} alt={s.alt} fill sizes="240px" className="object-cover object-top" />
                </div>
              </div>
              {captionOf(s) && <figcaption className="text-sm text-text-3">{captionOf(s)}</figcaption>}
            </figure>
          </li>
        ))}
      </ol>
      <div className="hidden md:block">
        <figure className="sticky top-[calc(50vh-280px)] flex flex-col items-center gap-3">
          <div className={FRAME}>
            <div className="relative aspect-[390/844] overflow-hidden rounded-[34px] bg-[#100f0f]">
              {WEEK.map((s, i) => (
                <Image
                  key={s.screen}
                  src={s.screen}
                  alt={i === active ? s.alt : ''}
                  aria-hidden={i !== active}
                  fill
                  sizes="280px"
                  className={`week-shot object-cover object-top ${i === active ? 'opacity-100' : 'opacity-0'}`}
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
  );
}
