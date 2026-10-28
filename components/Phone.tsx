import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  tilt?: 'left' | 'right' | 'none';
};

/** Device frame around a 390x844 app screenshot. */
export function Phone({ src, alt, priority, className, tilt = 'none' }: Props) {
  const rotate = tilt === 'left' ? '-rotate-3' : tilt === 'right' ? 'rotate-3' : '';
  return (
    <div
      className={`relative w-full max-w-[300px] rounded-[44px] border border-[rgba(255,255,255,0.14)] bg-[#0b0b0b] p-[10px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ${rotate} ${className ?? ''}`}
    >
      <div className="relative aspect-[390/844] overflow-hidden rounded-[34px] bg-[#100f0f]">
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 300px, 80vw" priority={priority} className="object-cover object-top" />
      </div>
    </div>
  );
}
