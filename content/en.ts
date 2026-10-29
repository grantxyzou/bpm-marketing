// All marketing copy lives here so a zh-CN file can sit beside it later.
// Voice: docs/app-overview.md §6. Plain, warm, no invented numbers, no emoji.

export type Hue = 'green' | 'amber' | 'blue' | 'violet' | 'orange';

export const WEEK = [
  {
    step: '01',
    title: 'Sign-ups open',
    screen: '/media/screens/home-signup.webp',
    clip: '/media/week/step-1',
    alt: 'BPM Home screen with the session time, venue and a Sign up button',
    body: 'Your organiser opens the week. You see the time, the place and the cost per person, plus a nudge if you’ve turned notifications on.',
  },
  {
    step: '02',
    title: 'Tap Join',
    screen: '/media/screens/roster-waitlist.webp',
    clip: '/media/week/step-2',
    alt: 'BPM roster with numbered players and a waitlist below',
    body: 'You get a numbered spot on the roster. If it’s full, you’re on the waitlist, in order, and you can see exactly where you stand.',
  },
  {
    step: '03',
    title: 'Play',
    screen: '/media/screens/balance.webp',
    clip: '/media/week/step-3',
    alt: 'BPM sign-up confirmation with a link to cancel your spot',
    body: 'Can’t make it after all? Cancel your own spot and the next person on the waitlist can move up.',
  },
  {
    step: '04',
    title: 'Send the bill',
    screen: '/media/screens/admin-send-the-bill.webp',
    clip: '/media/week/step-4',
    alt: 'BPM balance showing a $15 share and an I’ve sent it button being tapped',
    body: 'Court and shuttles are split across whoever played. You see your share, pay your organiser the way you already do, and tap “I’ve sent it”.',
  },
] as const;

export type FeatureArea = {
  id: string;
  hue: Hue;
  label: string;
  title: string;
  body: string;
  points: string[];
  screen: string;
  screenAlt: string;
};

export const FEATURE_AREAS: FeatureArea[] = [
  {
    id: 'sign-ups',
    hue: 'green',
    label: 'Sign-ups',
    title: 'Am I in this week? One look.',
    body: 'The Home screen answers the three questions people actually open the app for: when and where, am I in, and what do I owe.',
    points: [
      'One-tap Join with a numbered roster',
      'A real waitlist, in order, that organisers promote from',
      'Cancel your own spot, with a heads-up if it’s late',
      'Announcements with the cost per person right there',
    ],
    screen: '/media/screens/home-signup.webp',
    screenAlt: 'BPM Home screen showing the session time, venue, announcement and a Join button',
  },
  {
    id: 'money',
    hue: 'green',
    label: 'Money',
    title: 'Settling up without the awkward message.',
    body: 'Organisers split the court and shuttles across whoever played, then send the bill. Players see their share and mark it sent. Nobody has to keep a spreadsheet.',
    points: [
      'Cost per person worked out from court and shuttle costs',
      'Your balance and past receipts in one place',
      'A ledger for organisers, so the numbers add up',
      'Store credit and gift codes',
    ],
    screen: '/media/screens/balance.webp',
    screenAlt: 'BPM balance card showing what a player owes and an “I’ve sent it” button',
  },
  {
    id: 'stringing',
    hue: 'amber',
    label: 'Stringing',
    title: 'Restrings, without the back-and-forth.',
    body: 'If someone in your club strings rackets, players can ask for a restring, pick a string and tension, and follow the job until it’s ready.',
    points: [
      'A string map that trades control and feel against durability',
      'Tension picked with a guide, not a guess',
      'The stringer gets a queue, a string shelf and prices',
    ],
    screen: '/media/screens/stringing.webp',
    screenAlt: 'BPM Stringing tab with a restring request, string choice and tension',
  },
  {
    id: 'stats',
    hue: 'blue',
    label: 'Stats & learning',
    title: 'A record of your game, not a scoreboard.',
    body: 'Log games, see your record and who you play with most, and pick up one focus a week with drills to match. Progress is measured against your own past, never ranked against your friends.',
    points: [
      'Game log and your own record',
      'Kudos to the people you played with',
      'A weekly focus with drills',
      'Club comparison is opt-in, and private by default',
    ],
    screen: '/media/screens/stats-play.webp',
    screenAlt: 'BPM Stats tab showing a player’s game record and the people they play with',
  },
  {
    id: 'gear',
    hue: 'blue',
    label: 'Gear',
    title: 'Know your racket.',
    body: 'Add your racket and strings, and BPM tells you how the set-up fits the way you play, what string pairs well with it, and what to look at next.',
    points: ['Racket and string set-up', 'Fit profile and string pairing', 'Your racket in 3D, and a card you can share'],
    screen: '/media/screens/stats-gear.webp',
    screenAlt: 'BPM Gear screen with a racket set-up and string pairing',
  },
  {
    id: 'organisers',
    hue: 'orange',
    label: 'For organisers',
    title: 'The twenty-minute job, made smaller.',
    body: 'Everything the person running the session does each week, in one place: the session, the invite list, the waitlist, shuttles, costs and announcements.',
    points: [
      'Set the session, open and close sign-ups, skip a week',
      'One-time invite links instead of a public sign-up',
      'Shuttle stock and how long it will last',
      'Draft an announcement and tidy it up with AI before it goes out',
    ],
    screen: '/media/screens/admin-command-center.webp',
    screenAlt: 'BPM organiser console showing the next session, invite list and cost controls',
  },
];

export const DETAILS = [
  { title: 'Widgets', body: 'Join or undo from your home screen, and see what you owe on the app icon.' },
  { title: 'Notifications', body: 'A nudge when sign-ups open. That’s about it.' },
  { title: 'English and 简体中文', body: 'The whole app works in both. Switch any time from your profile.' },
  { title: 'Light and dark', body: 'Follows your phone, and stays readable under bright gym lights.' },
  { title: 'Sign in your way', body: 'A 4-digit PIN, Google, Apple or email. One account across every club you play with.' },
  { title: 'Yours to delete', body: 'Delete your account from the app any time. No email needed.' },
] as const;

export const FAQ = [
  {
    id: 'price',
    q: 'How much does it cost?',
    a: 'Nothing. BPM is free. If a paid plan ever comes along, it will be announced in the app first, and nothing you’ve already done becomes payable after the fact.',
  },
  {
    id: 'payments',
    q: 'Does BPM take payments?',
    a: 'No. BPM works out who owes what and keeps track of who has paid. The money itself goes from players to the organiser the way it already does.',
  },
  {
    id: 'who',
    q: 'Who is it for?',
    a: 'Casual clubs: friends and regulars who book a few courts once a week and split the cost. It isn’t a league manager or a court-booking platform.',
  },
  {
    id: 'start',
    q: 'Can I start a club for my own group?',
    a: 'Yes. Install the app, create an account, name your club and share an invite link. You become its organiser, and your club’s data is kept separate from every other club’s.',
  },
  {
    id: 'join',
    q: 'How do players join?',
    a: 'With a one-time invite link or code from the organiser, or by asking for access from the sign-in screen. There’s no public sign-up page to find.',
  },
  {
    id: 'devices',
    q: 'What does it run on?',
    a: 'iPhone and Android, both in beta right now, and any modern browser. It’s the same account everywhere.',
  },
  {
    id: 'android',
    q: 'The Android link says I don’t have access.',
    a: 'The Android beta is invite-only for now. Ask your organiser to add you, or use BPM in your browser in the meantime. Everything works there too.',
  },
  {
    id: 'language',
    q: 'Does it work in Chinese?',
    a: 'Yes. The app is fully bilingual in English and Simplified Chinese, and each person picks their own language.',
  },
  {
    id: 'data',
    q: 'What happens to my data?',
    a: 'The privacy policy spells out what is stored, why, and who processes it. You can delete your account from inside the app at any time.',
  },
] as const;
