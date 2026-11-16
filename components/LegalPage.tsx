import type { ReactNode } from 'react';
import { PageHero } from './PageHero';
import { appLegalUrl, fetchLegal, type LegalDocName } from '@/lib/legal';

const BULLET = '• ';

type Block = { kind: 'p'; text: string } | { kind: 'list'; items: string[] };

/** Paragraphs, with each run of `• ` lines gathered into one list (the app's own rule). */
function blocks(lines: string[]): Block[] {
  const out: Block[] = [];
  for (const line of lines) {
    if (line.startsWith(BULLET)) {
      const last = out[out.length - 1];
      if (last?.kind === 'list') last.items.push(line.slice(BULLET.length));
      else out.push({ kind: 'list', items: [line.slice(BULLET.length)] });
    } else out.push({ kind: 'p', text: line });
  }
  return out;
}

/** `**bold**` and nothing else, so the copy has no raw-HTML path. */
function inline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="font-semibold text-text">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      ),
    );
}

type Props = { doc: LegalDocName; path: string; label: string; fallbackTitle: string };

/** One legal page: the app's copy, in the site's design, at the site's address. */
export async function LegalPage({ doc, path, label, fallbackTitle }: Props) {
  const data = await fetchLegal(doc);
  return (
    <>
      <PageHero
        path={path}
        label={label}
        title={data?.title ?? fallbackTitle}
        lede={data ? data.updatedLabel : 'The current copy lives in the app.'}
        hue="violet"
      />
      <div className="container-site pb-16">
        <article className="flex max-w-3xl flex-col gap-10">
          {data ? (
            data.sections.map((s) => (
              <section key={s.h} className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold md:text-2xl">{s.h}</h2>
                {blocks(s.p).map((b, i) =>
                  b.kind === 'list' ? (
                    <ul key={i} className="flex list-disc flex-col gap-2 pl-6 text-text-2">
                      {b.items.map((it, j) => (
                        <li key={j}>{inline(it)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i} className="text-text-2">
                      {inline(b.text)}
                    </p>
                  ),
                )}
              </section>
            ))
          ) : (
            <p className="text-text-2">
              This page couldn’t be loaded just now.{' '}
              <a href={appLegalUrl(doc)} className="font-semibold text-text underline underline-offset-4">
                Read it in the app
              </a>
              .
            </p>
          )}
          {data?.supportEmail && (
            <section className="flex flex-col gap-2">
              <p className="text-text-2">{data.emailLabel}</p>
              <a href={`mailto:${data.supportEmail}`} className="self-start font-semibold text-text underline underline-offset-4">
                {data.supportEmail}
              </a>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
