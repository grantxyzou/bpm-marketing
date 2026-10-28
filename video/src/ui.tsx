import { loadFont } from '@remotion/fonts';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import spaceGrotesk from '../../app/fonts/SpaceGrotesk.woff2';
import plex from '../../app/fonts/IBMPlexSans.woff2';
import jetbrains from '../../app/fonts/JetBrainsMono.woff2';

loadFont({ family: 'Space Grotesk', url: spaceGrotesk, weight: '300 700' });
loadFont({ family: 'IBM Plex Sans', url: plex, weight: '100 700' });
loadFont({ family: 'JetBrains Mono', url: jetbrains, weight: '100 800' });

const CJK = "'WenQuanYi Zen Hei'";
export const FONT = {
  display: `'Space Grotesk', ${CJK}, sans-serif`,
  body: `'IBM Plex Sans', ${CJK}, sans-serif`,
  mono: `'JetBrains Mono', ${CJK}, monospace`,
};

export const C = {
  bg: '#100f0f',
  text: '#e8ecf1',
  text2: 'rgba(255,255,255,0.68)',
  text3: 'rgba(255,255,255,0.5)',
  green: '#4ade80',
  amber: '#fbbf24',
  blue: '#60a5fa',
  orange: '#fb923c',
  divider: 'rgba(255,255,255,0.08)',
};

export type Hue = 'green' | 'amber' | 'blue' | 'orange';
const FIELD: Record<Hue, string> = {
  green: 'rgba(74,222,128,0.26)',
  amber: 'rgba(251,191,36,0.24)',
  blue: 'rgba(96,165,250,0.26)',
  orange: 'rgba(251,146,60,0.24)',
};

export const glass = Easing.bezier(0.23, 1, 0.32, 1);

/** 0→1 over `len` frames starting at `start`, eased. */
export function useIn(start = 0, len = 20) {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: glass });
}

/** Scene wrapper: field glow, fade in and out. */
export function Scene({ hue = 'green', children }: { hue?: Hue; children: React.ReactNode }) {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(f, [0, 14, durationInFrames - 12, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT.body, color: C.text }}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 70% at 82% 0%, ${FIELD[hue]}, transparent 70%)`, opacity }} />
      <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
}

export function Rise({ start = 0, children, distance = 28, style }: { start?: number; children: React.ReactNode; distance?: number; style?: React.CSSProperties }) {
  const p = useIn(start, 22);
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * distance}px)`, ...style }}>{children}</div>;
}

export function Label({ children, hue = 'green' }: { children: React.ReactNode; hue?: Hue }) {
  return (
    <div style={{ fontFamily: FONT.mono, fontSize: 22, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: C[hue] }}>
      {children}
    </div>
  );
}

export function Headline({ children, size = 76 }: { children: React.ReactNode; size?: number }) {
  return (
    <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: size, lineHeight: 1.06, letterSpacing: '-0.02em', color: C.text }}>
      {children}
    </div>
  );
}

export function Body({ children, size = 32 }: { children: React.ReactNode; size?: number }) {
  return <div style={{ fontSize: size, lineHeight: 1.45, color: C.text2 }}>{children}</div>;
}

export const PHONE_RATIO = 844 / 390;

export function PhoneFrame({ width = 330, children, style }: { width?: number; children: React.ReactNode; style?: React.CSSProperties }) {
  const pad = Math.round(width * 0.034);
  const outer = Math.round(width * 0.145);
  return (
    <div
      style={{
        width,
        padding: pad,
        borderRadius: outer,
        background: '#0b0b0b',
        border: '1.5px solid rgba(255,255,255,0.14)',
        boxShadow: '0 40px 90px -24px rgba(0,0,0,0.75)',
        ...style,
      }}
    >
      <div style={{ position: 'relative', width: width - pad * 2, height: (width - pad * 2) * PHONE_RATIO, borderRadius: outer - pad, overflow: 'hidden', background: C.bg }}>
        {children}
      </div>
    </div>
  );
}

export function Screen({ name, width = 330, style }: { name: string; width?: number; style?: React.CSSProperties }) {
  return (
    <PhoneFrame width={width} style={style}>
      <Img src={staticFile(`media/screens/${name}.webp`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
    </PhoneFrame>
  );
}

export function ArcMark({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M8 54C18 38 31 15 45 13.5C52 12.8 53 19 53 33" stroke="#22c55e" strokeWidth="6.5" strokeLinecap="round" />
      <path d="M45.5 40.5h15l-4.6 11.2h-5.8z" fill="#e8e6e1" stroke="#22c55e" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M50.4 41v10.5M55.6 41v10.5" stroke="#22c55e" strokeWidth="1.2" />
      <circle cx="53" cy="56" r="4.4" fill="#e8e6e1" />
    </svg>
  );
}

/** Standard two-column feature layout: copy left, phones right. */
export function FeatureLayout({ hue, label, title, body, phones }: { hue: Hue; label: string; title: React.ReactNode; body: React.ReactNode; phones: React.ReactNode }) {
  return (
    <Scene hue={hue}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 140px', gap: 80 }}>
        <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Rise start={4}>
            <Label hue={hue}>{label}</Label>
          </Rise>
          <Rise start={10}>
            <Headline size={68}>{title}</Headline>
          </Rise>
          <Rise start={18}>
            <Body>{body}</Body>
          </Rise>
        </div>
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 36 }}>{phones}</div>
      </div>
    </Scene>
  );
}
