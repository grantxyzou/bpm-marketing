import { OG_SIZE, ogImage } from '@/lib/og';

export const alt = 'BPM: How it’s built';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage('One app, three front doors.', 'How it’s built');
}
