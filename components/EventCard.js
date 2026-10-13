import Tag from './Tag';
import EventPhotoCarousel from './EventPhotoCarousel';

/**
 * Concept: reusable text-only event card (props).
 * Used for events without photos (SFK).
 */
export function TextEventCard({ event }) {
  return (
    <article className="flex h-full flex-col border-b border-border p-6 md:border-b-0 md:border-r md:last:border-r-0">
      <p className="mono-caps text-primary">{event.date}</p>
      <h3 className="mt-3 text-lg font-semibold text-foreground sm:text-xl">
        {event.title}
      </h3>
      {event.place ? (
        <p className="mono-caps mt-1 text-muted-foreground">{event.place}</p>
      ) : null}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {event.short}
      </p>
      {event.tookFromIt?.length ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {event.tookFromIt.slice(0, 5).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      ) : null}
    </article>
  );
}

/**
 * Photo event block: title/date above, client carousel (one photo at a time),
 * short/body + tags below. Images passed from Server parent → Client child.
 */
export function PhotoEventFeature({ event, showBody = false }) {
  if (!event?.images?.length) return null;

  const paragraphs =
    showBody && event.body?.length ? event.body : null;

  return (
    <div className="border border-border">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="mono-caps text-primary">{event.date}</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {event.title}
          </h3>
        </div>
        {event.place ? (
          <p className="mono-caps text-muted-foreground">{event.place}</p>
        ) : null}
      </div>

      <EventPhotoCarousel images={event.images} title={event.title} />

      {paragraphs ? (
        <div className="space-y-4 border-t border-border px-5 py-5">
          {paragraphs.map((p) => (
            <p
              key={p.slice(0, 56)}
              className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground"
            >
              {p}
            </p>
          ))}
        </div>
      ) : event.short ? (
        <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          {event.short}
        </p>
      ) : null}

      {event.tookFromIt?.length ? (
        <div className="flex flex-wrap gap-1.5 border-t border-border px-5 py-4">
          {event.tookFromIt.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Community events: text-only (SFK), then photo carousels (DevFest, Digi Camp).
 */
export default function CommunityEvents({
  events,
  showTags = false,
  showDigiBody = false,
}) {
  const textEvents = events.filter(
    (e) => !e.images || e.images.length === 0
  );
  const photoEvents = events.filter((e) => e.images?.length > 0);

  return (
    <div className="space-y-8">
      {textEvents.length > 0 ? (
        <div
          className={
            textEvents.length === 1
              ? 'border border-border'
              : 'grid border border-border md:grid-cols-2'
          }
        >
          {textEvents.map((event) => (
            <TextEventCard key={event.id} event={event} />
          ))}
        </div>
      ) : null}

      {photoEvents.map((event) => (
        <PhotoEventFeature
          key={event.id}
          event={event}
          showBody={showDigiBody && event.id === 'digi-camp-2026'}
        />
      ))}

      {showTags
        ? textEvents.map((event) =>
            event.tookFromIt?.length ? (
              <div key={`tags-${event.id}`} className="border border-border p-4">
                <p className="mono-caps text-muted-foreground">{event.title}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {event.tookFromIt.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            ) : null
          )
        : null}
    </div>
  );
}