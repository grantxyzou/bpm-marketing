import type { FeatureArea } from '@/content/en';
import { Phone } from './Phone';

export function FeatureRow({ area, flip, headingLevel = 'h3' }: { area: FeatureArea; flip?: boolean; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  return (
    <article
      id={area.id}
      className="field grid scroll-mt-24 items-center gap-10 overflow-hidden rounded-[var(--radius-field)] border border-divider px-6 py-10 md:grid-cols-2 md:gap-16 md:px-12 md:py-14"
      data-hue={area.hue}
    >
      <div className={`flex flex-col gap-4 ${flip ? 'md:order-2' : ''}`}>
        <p className="label" data-hue={area.hue}>
          {area.label}
        </p>
        <H className="text-[1.75rem] font-bold md:text-[2.25rem]">{area.title}</H>
        <p className="text-text-2">{area.body}</p>
        <ul className="mt-2 flex flex-col gap-2.5">
          {area.points.map((p) => (
            <li key={p} className="flex gap-3 text-[15px] text-text-2">
              <svg className="mt-[5px] shrink-0" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M2 7.5l3 3 7-7" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className={`flex justify-center ${flip ? 'md:order-1' : ''}`}>
        <Phone src={area.screen} alt={area.screenAlt} className="max-w-[270px]" />
      </div>
    </article>
  );
}
