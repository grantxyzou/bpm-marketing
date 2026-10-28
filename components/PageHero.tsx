import type { Hue } from '@/content/en';

export function PageHero({ label, title, lede, hue = 'green', children }: { label: string; title: string; lede: string; hue?: Hue; children?: React.ReactNode }) {
  return (
    <section className="field overflow-hidden" data-hue={hue}>
      <div className="container-site flex flex-col gap-5 pb-10 pt-14 md:pb-14 md:pt-20">
        <p className="label" data-hue={hue}>
          {label}
        </p>
        <h1 className="max-w-4xl text-[2.4rem] font-bold md:text-[3.5rem]">{title}</h1>
        <p className="lede">{lede}</p>
        {children}
      </div>
    </section>
  );
}
