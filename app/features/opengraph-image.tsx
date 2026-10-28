import { OG_SIZE, ogImage } from '@/lib/og';

export const alt = 'BPM: Features';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage('Everything a weekly session needs.', 'Features');
}
