import { OG_SIZE, ogImage } from '@/lib/og';

export const alt = 'BPM: How it works';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage('One week, two points of view.', 'How it works');
}
