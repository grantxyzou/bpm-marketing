import { OffthreadVideo, Series, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { ArcMark, Body, C, FeatureLayout, FONT, Headline, Label, PhoneFrame, Rise, Scene, Screen, glass, useIn } from './ui';

const CHAT = [
  { who: 'Organiser', text: 'Courts 2 and 3 booked for Thursday, 8pm. Who’s in?' },
  { who: 'A', text: 'me' },
  { who: 'B', text: '+1, maybe +2' },
  { who: 'C', text: 'wait is this week or next week' },
  { who: 'D', text: 'am I in? I said yes on Monday' },
  { who: 'Organiser', text: 'Reminder: still waiting on 4 people for last week’s shuttles…' },
];

function Title() {
  const mark = useIn(0, 24);
  return (
    <Scene>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 180px', gap: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: mark, transform: `translateY(${(1 - mark) * 20}px)` }}>
          <ArcMark size={110} />
          <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 84, letterSpacing: '-0.04em' }}>
            bpm<span style={{ color: C.green }}>.</span>
          </div>
        </div>
        <Rise start={26}>
          <Label>For casual badminton clubs</Label>
        </Rise>
        <Rise start={34}>
          <Headline size={104}>
            Your weekly session,
            <br />
            without the group-chat admin.
          </Headline>
        </Rise>
      </div>
    </Scene>
  );
}

function Problem() {
  const f = useCurrentFrame();
  return (
    <Scene>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 140px', gap: 100 }}>
        <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Rise start={4}>
            <Label>Sound familiar?</Label>
          </Rise>
          <Rise start={10}>
            <Headline size={68}>The group chat was never meant to be a sign-up sheet.</Headline>
          </Rise>
          <Rise start={110}>
            <Body>BPM takes that job off the organiser’s hands.</Body>
          </Rise>
        </div>
        <div
          style={{
            flex: '0 0 700px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: 32,
            borderRadius: 24,
            border: '1.5px solid rgba(255,255,255,0.12)',
            background: 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          }}
        >
          {CHAT.map((m, i) => {
            const start = 16 + i * 13;
            const p = interpolate(f, [start, start + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: glass });
            const mine = m.who === 'Organiser';
            return (
              <div key={i} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '14px 22px',
                    borderRadius: 22,
                    fontSize: 28,
                    lineHeight: 1.35,
                    background: mine ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Scene>
  );
}

function SignUps() {
  return (
    <FeatureLayout
      hue="green"
      label="Sign-ups"
      title={<>Am I in this week? One look.</>}
      body={
        <>
          Tap Join and you get a numbered spot on the roster.
          <br />
          If it’s full, you’re on the waitlist, in order.
        </>
      }
      phones={
        <Rise start={6} distance={40}>
          <PhoneFrame width={380}>
            <OffthreadVideo src={staticFile('media/hero-loop.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
          </PhoneFrame>
        </Rise>
      }
    />
  );
}

function Waitlist() {
  return (
    <FeatureLayout
      hue="green"
      label="The waitlist"
      title={<>Thirteen people, twelve spots.</>}
      body={<>The thirteenth lands on a waitlist, in order, and knows it. Can’t make it? Cancel your own spot and the next person can move up.</>}
      phones={
        <Rise start={6} distance={40}>
          <Screen name="roster-waitlist" width={350} />
        </Rise>
      }
    />
  );
}

function Money() {
  return (
    <FeatureLayout
      hue="green"
      label="Money"
      title={<>Settling up without the awkward message.</>}
      body={<>Court and shuttles are split across whoever played. Send the bill, and everyone sees their share and marks it sent.</>}
      phones={
        <>
          <Rise start={6} distance={40}>
            <Screen name="admin-send-the-bill" width={320} />
          </Rise>
          <Rise start={16} distance={40} style={{ marginTop: 80 }}>
            <Screen name="balance" width={320} />
          </Rise>
        </>
      }
    />
  );
}

function Stringing() {
  return (
    <FeatureLayout
      hue="amber"
      label="Stringing"
      title={<>Restrings, without<br />the back-and-forth.</>}
      body={<>Ask for a restring, pick a string and tension, and follow the job until it’s ready.</>}
      phones={
        <Rise start={6} distance={40}>
          <Screen name="stringing" width={350} />
        </Rise>
      }
    />
  );
}

function Stats() {
  return (
    <FeatureLayout
      hue="blue"
      label="Stats & gear"
      title={<>A record of your game, not a scoreboard.</>}
      body={<>Log games, try the week’s drill, and see how your racket and strings fit the way you play. Measured against your own past, never ranked against your friends.</>}
      phones={
        <>
          <Rise start={6} distance={40}>
            <Screen name="stats-play" width={320} />
          </Rise>
          <Rise start={16} distance={40} style={{ marginTop: 80 }}>
            <Screen name="stats-gear" width={320} />
          </Rise>
        </>
      }
    />
  );
}

function Organisers() {
  return (
    <FeatureLayout
      hue="orange"
      label="For organisers"
      title={<>The twenty-minute job, made smaller.</>}
      body={<>The session, the invite list, the waitlist, shuttles, costs and announcements, in one place. Start a club in a few minutes and share an invite link.</>}
      phones={
        <>
          <Rise start={6} distance={40}>
            <Screen name="admin-command-center" width={320} />
          </Rise>
          <Rise start={16} distance={40} style={{ marginTop: 80 }}>
            <Screen name="create-club" width={320} />
          </Rise>
        </>
      }
    />
  );
}

const DETAILS = [
  ['Widgets', 'Join or undo from your home screen.'],
  ['Notifications', 'A nudge when sign-ups open.'],
  ['English and 简体中文', 'The whole app works in both.'],
  ['Light and dark', 'Readable under bright gym lights.'],
];

function Details() {
  return (
    <Scene>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 140px', gap: 64 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Rise start={4}>
            <Label>The details</Label>
          </Rise>
          <Rise start={10}>
            <Headline size={80}>The little things, handled.</Headline>
          </Rise>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
          {DETAILS.map(([t, b], i) => (
            <Rise key={t} start={22 + i * 8}>
              <div style={{ borderTop: `1.5px solid ${C.divider}`, paddingTop: 26, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 36 }}>{t}</div>
                <div style={{ fontSize: 26, lineHeight: 1.4, color: C.text2 }}>{b}</div>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </Scene>
  );
}

function Cta() {
  return (
    <Scene>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 36 }}>
        <Rise start={0}>
          <ArcMark size={120} />
        </Rise>
        <Rise start={8}>
          <Headline size={100}>Get your group on the court.</Headline>
        </Rise>
        <Rise start={18}>
          <Body size={36}>Free. iPhone and Android beta, or in your browser.</Body>
        </Rise>
        <Rise start={28}>
          <div
            style={{
              marginTop: 12,
              padding: '18px 34px',
              borderRadius: 14,
              background: '#22c55e',
              color: '#052e16',
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: '0.02em',
            }}
          >
            www.motioncraft-bpm.com
          </div>
        </Rise>
      </div>
    </Scene>
  );
}

export const SCENES = [
  { C: Title, d: 150 },
  { C: Problem, d: 180 },
  { C: SignUps, d: 318 },
  { C: Waitlist, d: 165 },
  { C: Money, d: 180 },
  { C: Stringing, d: 150 },
  { C: Stats, d: 195 },
  { C: Organisers, d: 195 },
  { C: Details, d: 165 },
  { C: Cta, d: 180 },
];

export const TOTAL = SCENES.reduce((n, s) => n + s.d, 0);

export function Promo() {
  return (
    <Series>
      {SCENES.map(({ C: Comp, d }, i) => (
        <Series.Sequence key={i} durationInFrames={d}>
          <Comp />
        </Series.Sequence>
      ))}
    </Series>
  );
}
