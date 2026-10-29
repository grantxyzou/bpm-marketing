import { OG_SIZE, ogImage } from '@/lib/og';

export const alt = 'BPM: For stringers';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage('Run your club’s restringing like a small shop.', 'For stringers');
}
