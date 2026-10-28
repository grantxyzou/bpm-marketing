import type { Hue } from '@/content/en';

type Props = {
  id?: string;
  label?: string;
  hue?: Hue;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  center?: boolean;
};

export function Section({ id, label, hue = 'green', title, lede, children, className, center }: Props) {
  return (
    <section id={id} className={`container-site scroll-mt-24 py-16 md:py-24 ${className ?? ''}`}>
      <div className={`mb-10 flex flex-col gap-4 md:mb-14 ${center ? 'items-center text-center' : ''}`}>
        {label && (
          <p className="label" data-hue={hue}>
            {label}
          </p>
        )}
        <h2 className="max-w-3xl text-[2rem] font-bold md:text-[2.75rem]">{title}</h2>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {children}
    </section>
  );
}
