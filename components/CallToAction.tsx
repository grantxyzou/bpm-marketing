import { GetTheApp } from './GetTheApp';

export function CallToAction() {
  return (
    <section className="container-site">
      <div className="field glass flex flex-col items-start gap-6 overflow-hidden !rounded-[var(--radius-field)] px-6 py-12 md:flex-row md:items-center md:justify-between md:px-14 md:py-16">
        <div className="flex max-w-xl flex-col gap-3">
          <h2 className="text-[2rem] font-bold md:text-[2.5rem]">Get your group on the court.</h2>
          <p className="text-text-2">Free, on iPhone, Android and the web. The beta is open now.</p>
        </div>
        <GetTheApp compact showNote={false} />
      </div>
    </section>
  );
}
