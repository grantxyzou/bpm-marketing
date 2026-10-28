import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const OG_SIZE = { width: 1200, height: 630 };

export async function ogImage(title: string, kicker = 'For casual badminton clubs') {
  const font = await readFile(join(process.cwd(), 'assets/SpaceGrotesk-Bold.woff'));
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'radial-gradient(70% 80% at 85% 0%, rgba(74,222,128,0.30), rgba(16,15,15,0) 70%), #100f0f',
          color: '#e8ecf1',
          fontFamily: 'Space Grotesk',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M8 54C18 38 31 15 45 13.5C52 12.8 53 19 53 33" stroke="#22c55e" strokeWidth="6.5" strokeLinecap="round" />
            <path d="M45.5 40.5h15l-4.6 11.2h-5.8z" fill="#e8e6e1" stroke="#22c55e" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="53" cy="56" r="4.4" fill="#e8e6e1" />
          </svg>
          <div style={{ display: 'flex', fontSize: 44, fontWeight: 700, letterSpacing: '-0.04em' }}>
            bpm<span style={{ color: '#4ade80' }}>.</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ fontSize: 24, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4ade80' }}>{kicker}</div>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: 980 }}>{title}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: 'Space Grotesk', data: font, weight: 700, style: 'normal' }] },
  );
}
