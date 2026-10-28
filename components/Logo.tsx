type Props = { size?: number; withWordmark?: boolean; className?: string };

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <path
        d="M8 54C18 38 31 15 45 13.5C52 12.8 53 19 53 33"
        stroke="var(--accent-strong)"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path d="M45.5 40.5h15l-4.6 11.2h-5.8z" fill="#e8e6e1" stroke="var(--accent-strong)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M50.4 41v10.5M55.6 41v10.5" stroke="var(--accent-strong)" strokeWidth="1.2" />
      <circle cx="53" cy="56" r="4.4" fill="#e8e6e1" />
    </svg>
  );
}

export function Logo({ size = 30, withWordmark = true, className }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className="font-display text-[1.35rem] font-bold tracking-[-0.04em] text-text">
          bpm<span className="text-accent">.</span>
        </span>
      )}
    </span>
  );
}
