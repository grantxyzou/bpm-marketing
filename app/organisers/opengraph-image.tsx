import { OG_SIZE, ogImage } from '@/lib/og';

export const alt = 'BPM: For organisers';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage('You book the courts. BPM does the rest of the admin.', 'For organisers');
}
