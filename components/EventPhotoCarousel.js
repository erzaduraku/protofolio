'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Concept: Client Component with useState for interactive carousel.
 * object-contain on navy bg so faces/full photos stay visible (no harsh crop).
 * Crossfade + soft slide (~500ms). Compact: max-w-[760px], max height ~420px.
 */
export default function EventPhotoCarousel({ images, title }) {
  const slides = images?.length ? images : [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = slides.length;
  const go = useCallback(
    (dir) => {
      if (count === 0) return;
      setIndex((i) => (i + dir + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1 || paused) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 4000);
    return () => clearInterval(id);
  }, [count, paused]);

  if (count === 0) return null;

  return (
    <div
      className="relative mx-auto w-full max-w-[760px] border-b border-border bg-[var(--background)] sm:border-x"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[240px] w-full overflow-hidden sm:h-[320px] lg:h-[420px]">
        {slides.map((src, i) => {
          const active = i === index;
          return (
            <div
              key={src}
              className={
                'absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ' +
                (active
                  ? 'z-[1] translate-x-0 opacity-100'
                  : 'z-0 translate-x-2 opacity-0 pointer-events-none')
              }
              aria-hidden={!active}
            >
              <Image
                src={src}
                alt={`${title} — photo ${i + 1}`}
                fill
                sizes="(max-width: 760px) 100vw, 760px"
                className="object-contain p-1 sm:p-2"
                priority={i === 0}
              />
            </div>
          );
        })}
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 z-[2] flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-border/80 bg-background/70 text-muted-foreground shadow-sm backdrop-blur-md transition-all duration-200 hover:border-primary hover:bg-background/90 hover:text-primary sm:left-3"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 z-[2] flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-border/80 bg-background/70 text-muted-foreground shadow-sm backdrop-blur-md transition-all duration-200 hover:border-primary hover:bg-background/90 hover:text-primary sm:right-3"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>

          <div className="absolute bottom-3 left-1/2 z-[2] flex -translate-x-1/2 gap-1.5 rounded-full border border-border/60 bg-background/50 px-2.5 py-1.5 backdrop-blur-md">
            {slides.map((src, i) => (
              <button
                key={`dot-${src}`}
                type="button"
                aria-label={`Go to photo ${i + 1}`}
                onClick={() => setIndex(i)}
                className={
                  'transition-all duration-300 ' +
                  (i === index
                    ? 'h-1.5 w-4 bg-primary'
                    : 'h-1.5 w-1.5 bg-foreground/35 hover:bg-foreground/65')
                }
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}