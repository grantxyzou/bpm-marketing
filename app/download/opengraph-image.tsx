import { OG_SIZE, ogImage } from '@/lib/og';

export const alt = 'BPM: Get the app';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage('Free on iPhone, Android and the web.', 'Get the app');
}
