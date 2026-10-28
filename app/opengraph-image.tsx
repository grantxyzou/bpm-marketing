import { OG_SIZE, ogImage } from '@/lib/og';

export const alt = 'BPM: your weekly badminton session, without the group-chat admin';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage('Your weekly session, without the group-chat admin.');
}
