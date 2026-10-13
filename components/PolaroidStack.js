'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useMediaQuery, { REDUCED_MOTION } from '@/lib/useMediaQuery';

/**
 * Concept: Client Component with useState — a stacked polaroid gallery.
 *
 * - Photos rest in a loose stack (slight rotations); they fan out on
 *   hover or keyboard focus, or with the "Fan out" button (aria-pressed).
 * - "Next photo" moves the top print to the back (keyboard-friendly cycling).
 * - Each print can be dragged around inside the stack area (Framer drag with
 *   constraints) and springs back when released.
 * - Natural aspect ratios (h-auto), so no faces get cropped.
 * - Reduced motion: no fan animation (instant), no dragging.
 */
const STACK = [
  { x: 0, y: 0, rotate: -3 },
  { x: 5, y: -3, rotate: 4 },
  { x: -6, y: 2, rotate: -7 },
  { x: 7, y: 4, rotate: 7 },
  { x: -3, y: -5, rotate: 2 },
  { x: 2, y: 5, rotate: -5 },
];

export default function PolaroidStack({ images = [], alts = [], captions = [], title }) {
  const count = images.length;
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const [order, setOrder] = useState(() => images.map((_, i) => i)); // order[0] = top print
  const [pinned, setPinned] = useState(null); // null = follow hover/focus; true/false = user choice
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const areaRef = useRef(null);

  if (count === 0) return null;

  const open = pinned ?? (hovered || focused);
  const top = order[0];
  const altFor = (i) => alts[i] || `${title}, photo ${i + 1} of ${count}`;
  const captionFor = (i) => captions[i] || title;
  const transition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 210, damping: 24, mass: 0.8 };

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
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPinned(null);
      }}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setFocused(false);
          setPinned(null);
        }
      }}
    >
      <div
        ref={areaRef}
        role="group"
        aria-label={`${title}: ${count} photos`}
        className="relative grid min-h-76 place-items-center px-[8%] py-10 sm:min-h-100"
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

      <div className="mt-2 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          className="btn-chip"
          aria-pressed={open}
          onClick={() => setPinned(!open)}
        >
          {open ? 'Stack photos' : 'Fan out photos'}
        </button>
        <button
          type="button"
          className="btn-chip"
          onClick={() => setOrder((prev) => [...prev.slice(1), prev[0]])}
        >
          Next photo
        </button>
        <p className="text-sm text-ink-soft" aria-live="polite">
          <span className="sr-only">On top: </span>
          {top + 1}/{count} · {captionFor(top)}
        </p>
      </div>
    </div>
  );
}
