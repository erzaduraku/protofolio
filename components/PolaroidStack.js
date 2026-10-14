'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useMediaQuery, { REDUCED_MOTION } from '@/lib/useMediaQuery';
import { getDict } from '@/lib/i18n';

/** Reduced motion: no fan animation and no dragging. */
const STACK = [
  { x: 0, y: 0, rotate: -3 },
  { x: 5, y: -3, rotate: 4 },
  { x: -6, y: 2, rotate: -7 },
  { x: 7, y: 4, rotate: 7 },
  { x: -3, y: -5, rotate: 2 },
  { x: 2, y: 5, rotate: -5 },
];

export default function PolaroidStack({ images = [], alts = [], captions = [], title, locale = 'en' }) {
  const t = getDict(locale).polaroid;
  const count = images.length;
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const [order, setOrder] = useState(() => images.map((_, i) => i)); // order[0] = top print
  const [hovered, setHovered] = useState(false);
  const areaRef = useRef(null);
  const dragged = useRef(false); // a drag should not count as a click

  if (count === 0) return null;

  const open = hovered;
  const top = order[0];
  const altFor = (i) => alts[i] || t.photo(title, i + 1, count);
  const captionFor = (i) => captions[i] || title;
  const transition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 210, damping: 24, mass: 0.8 };

  const next = () => setOrder((prev) => [...prev.slice(1), prev[0]]);

  function poseFor(i) {
    const depth = order.indexOf(i);
    if (open) {
      const k = i - (count - 1) / 2;
      return { x: `${k * 24}%`, y: `${Math.abs(k) * 5}%`, rotate: k * 5, z: count - depth };
    }
    const s = STACK[depth % STACK.length];
    return { x: `${s.x}%`, y: `${s.y}%`, rotate: s.rotate, z: count - depth };
  }

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div
        ref={areaRef}
        role="button"
        tabIndex={0}
        aria-label={t.next(top + 1, count, captionFor(top))}
        onClick={() => {
          if (dragged.current) {
            dragged.current = false;
            return;
          }
          next();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            next();
          }
        }}
        className="relative grid min-h-76 cursor-pointer rounded-sm place-items-center px-[8%] py-10 sm:min-h-100"
      >
        {images.map((src, i) => {
          const pose = poseFor(i);
          return (
            <motion.figure
              key={src}
              className={`relative col-start-1 row-start-1 w-3/5 max-w-72.5 bg-paper-light p-2.5 pb-3 sheet-shadow sm:p-3 ${
                reducedMotion ? '' : 'cursor-grab active:cursor-grabbing'
              }`}
              style={{ zIndex: pose.z }}
              initial={false}
              animate={{ x: pose.x, y: pose.y, rotate: pose.rotate }}
              transition={transition}
              drag={!reducedMotion}
              dragConstraints={areaRef}
              dragElastic={0.2}
              dragSnapToOrigin
              onDragStart={() => {
                dragged.current = true;
              }}
              whileDrag={reducedMotion ? undefined : { scale: 1.04, rotate: 0 }}
            >
              <span aria-hidden="true" className="polaroid-tape" />
              <Image
                src={src}
                alt={altFor(i)}
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 290px, 60vw"
                draggable={false}
                className="pointer-events-none block h-auto w-full select-none bg-paper-deep"
              />
              <figcaption className="mt-2.5 px-1 font-display text-[1.05rem] italic leading-snug text-ink-soft">
                {captionFor(i)}
              </figcaption>
            </motion.figure>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {t.live(top + 1, count, captionFor(top))}
      </p>
    </div>
  );
}
