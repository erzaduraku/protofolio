import { getCv, CV_PDF } from '@/lib/cv';
import { getDict, localePath } from '@/lib/i18n';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const meta = getDict(locale).meta.cv;
  // Same title/description, plus openGraph/twitter so a shared /cv link has its own preview.
  // They replace the layout's values, so the share image from opengraph-image.js is repeated.
  const images = [localePath(locale, '/opengraph-image')];
  return {
    ...meta,
    openGraph: { type: 'profile', siteName: 'Erza Duraku', title: meta.title, description: meta.description, images },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description, images },
  };
}

function Block({ id, title, children }) {
  return (
    <section aria-labelledby={id} className="grid gap-6 border-t border-line-strong pt-8 lg:grid-cols-12 lg:gap-10">
      <h2 id={id} className="display text-[clamp(1.7rem,2.6vw,2.3rem)] lg:col-span-3">
        {title}
      </h2>
      <div className="min-w-0 lg:col-span-9">{children}</div>
    </section>
  );
}

function Entry({ period, title, place, children }) {
  return (
    <li className="grid gap-2 py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
      <p className="mono-label text-thread">{period}</p>
      <div className="min-w-0">
        <h3 className="font-display text-2xl leading-snug">{title}</h3>
        {place ? <p className="mt-1 font-medium text-ink">{place}</p> : null}
        <div className="mt-2 space-y-1 text-ink-soft">{children}</div>
      </div>
    </li>
  );
}

/** Concept: static route /cv — the full CV as a web page, plus the original PDF. */
export default async function CvPage({ params }) {
  const { locale } = await params;
  const t = getDict(locale).cv;
  const newTab = getDict(locale).common.newTab;
  const cv = getCv(locale);
  const h = cv.headings;

  return (
    <article className="container-page relative overflow-x-clip pt-14 pb-24 sm:pt-20 sm:pb-32">
      <p className="kicker">{t.kicker}</p>
      <h1 className="display mt-5 text-[clamp(2.8rem,7vw,6rem)]">{cv.name}</h1>

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <dl className="sheet-shadow grid gap-x-8 gap-y-3 bg-paper-light p-6 sm:grid-cols-2 sm:p-8 lg:col-span-8">
          {cv.contact.map((row) => (
            <div key={`${row.label}-${row.value}`} className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">{row.label}</dt>
              <dd className="wrap-break-word">
                {row.href ? (
                  <a
                    href={row.href}
                    className="link-stitch"
                    {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {row.value}
                    {row.external ? <span className="sr-only">{newTab}</span> : null}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
        <dl className="grid content-start gap-3 border-l-2 border-thread pl-6 lg:col-span-4">
          {cv.personal.map((row) => (
            <div key={row.label}>
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-16 space-y-16">
        <Block id="cv-about" title={h.about}>
          <p className="max-w-3xl text-xl leading-relaxed text-ink">{cv.about}</p>
        </Block>

        <Block id="cv-education" title={h.education}>
          <ol className="divide-y divide-line-strong">
            {cv.education.map((e) => (
              <Entry key={e.title} period={e.period} title={e.title} place={e.place}>
                <p>{e.location}</p>
                {e.details?.map((d) => (
                  <p key={d}>{d}</p>
                ))}
                {e.certificate ? (
                  <a href={e.certificate} target="_blank" rel="noopener noreferrer" className="link-stitch mt-2 inline-block font-medium">
                    {getDict(locale).common.viewCertificate} <span aria-hidden="true">↗</span>
                    <span className="sr-only">{newTab}</span>
                  </a>
                ) : null}
              </Entry>
            ))}
          </ol>
        </Block>

        <Block id="cv-languages" title={h.languages}>
          <p>
            <span className="text-ink-soft">{h.mother} </span>
            <span className="font-medium">{cv.languages.mother}</span>
          </p>
          <p className="mt-4 text-ink-soft">{h.other}</p>
          {cv.languages.other.map((lang) => (
            <div key={lang.name} className="mt-2">
              <p className="font-display text-2xl">{lang.name}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {lang.levels.map(([skill, level]) => (
                  <li key={skill} className="chip">
                    {skill} {level}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="mt-4 text-sm text-ink-soft">{cv.languages.note}</p>
        </Block>

        <Block id="cv-skills" title={h.skills}>
          <div className="space-y-8">
            {cv.skills.map((g) => (
              <div key={g.group}>
                <h3 className="font-display text-2xl">{g.group}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>

        <Block id="cv-volunteering" title={h.volunteering}>
          <ol className="divide-y divide-line-strong">
            {cv.volunteering.map((v) => (
              <Entry key={v.title} period={v.period} title={v.title} place={v.place}>
                <p>{v.text}</p>
              </Entry>
            ))}
          </ol>
        </Block>
      </div>

      <div className="mt-20 flex flex-wrap items-center gap-4 border-t border-line-strong pt-10">
        <a href={CV_PDF} download="Erza-Duraku-CV.pdf" className="btn-ink">
          {t.download} <span aria-hidden="true">↓</span>
        </a>
        <span className="text-sm text-ink-soft">{t.pdfNote}</span>
      </div>
    </article>
  );
}
