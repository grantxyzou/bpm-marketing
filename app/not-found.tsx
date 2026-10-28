import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="field container-site flex min-h-[60vh] flex-col items-start justify-center gap-5 py-20">
      <p className="label">404</p>
      <h1 className="text-[2.4rem] font-bold md:text-[3.2rem]">Out of bounds.</h1>
      <p className="lede">That page isn’t here. It may have moved when the site was rebuilt.</p>
      <Link href="/" className="btn btn-primary">
        Back to the home page
      </Link>
    </section>
  );
}
