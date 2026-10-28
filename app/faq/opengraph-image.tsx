import { OG_SIZE, ogImage } from '@/lib/og';

export const alt = 'BPM: FAQ';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage('Questions people actually ask.', 'FAQ');
}
