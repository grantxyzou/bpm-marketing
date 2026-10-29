import Link from 'next/link';
import type { ComponentProps } from 'react';

const PAGE_TRANSITION = ['page'];

// Tags in-site navigations so <PageTransition> cross-fades them; browser Back carries no type and stays instant.
export default function SiteLink(props: ComponentProps<typeof Link>) {
  return <Link transitionTypes={PAGE_TRANSITION} {...props} />;
}
