import { Composition } from 'remotion';
import { Promo, TOTAL } from './Promo';

export function Root() {
  return <Composition id="Promo" component={Promo} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />;
}
