'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import useMediaQuery, { FINE_POINTER_MOTION } from '@/hooks/use-media-query';

/** Load animation is CSS keyframes so it runs before hydration; mouse parallax on fine pointers only. */
const SRC = '/engineering-craft-ink.jpg';

const PIECES = [
  {
    id: 'bodice',
    clip: 'polygon(0% 0%, 62% 0%, 58% 30%, 61% 52%, 0% 58%)',
    points: '0,0 62,0 58,30 61,52 0,58',
    depth: 10,
    from: { x: '-46px', y: '-34px', r: '-5deg' },
    delay: 300,
  },
  {
    id: 'panel',
    clip: 'polygon(62% 0%, 100% 0%, 100% 100%, 57% 100%, 61% 52%, 58% 30%)',
    points: '62,0 100,0 100,100 57,100 61,52 58,30',
    depth: 22,
    from: { x: '58px', y: '-18px', r: '4deg' },
    delay: 450,
  },
  {
    id: 'facing',
    clip: 'polygon(0% 58%, 61% 52%, 57% 100%, 0% 100%)',
    points: '0,58 61,52 57,100 0,100',
    depth: 6,
    from: { x: '-26px', y: '46px', r: '3deg' },
    delay: 600,
  },
];

function Piece({ piece, mx, my, first }) {
  const x = useTransform(mx, (v) => v * piece.depth);
  const y = useTransform(my, (v) => v * piece.depth);

  return (
    <motion.div className="absolute inset-0" style={{ x, y }}>
      <div
        className="piece absolute inset-0"
        style={{
          '--fx': piece.from.x,
          '--fy': piece.from.y,
          '--fr': piece.from.r,
          '--delay': `${piece.delay}ms`,
          filter: 'drop-shadow(0 14px 16px rgb(31 61 43 / 0.22))',
        }}
      >
        <div className="absolute inset-0" style={{ clipPath: piece.clip }}>
          <Image
            src={SRC}
            alt=""
            fill
            priority={first}
            loading={first ? undefined : 'eager'}
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover"
          />
        </div>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <polygon
            points={piece.points}
            fill="none"
            stroke="var(--paper)"
            strokeOpacity="0.75"
            strokeWidth="1"
            strokeDasharray="5 5"
            vectorEffect="non-scaling-stroke"
            transform="translate(50 50) scale(0.965) translate(-50 -50)"
          />
        </svg>
      </div>
    </motion.div>
  );
}

export default function HeroPieces({ label, caption }) {
  const parallax = useMediaQuery(FINE_POINTER_MOTION);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 70, damping: 18, mass: 0.6 });
  const my = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (!parallax) {
      rawX.set(0);
      rawY.set(0);
      return undefined;
    }
    const onMove = (e) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [parallax, rawX, rawY]);

  return (
    <figure className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-3 translate-x-5 translate-y-5 border border-dashed border-line-strong"
      />
      <div role="img" aria-label={label} className="relative aspect-4/3 w-full">
        {PIECES.map((piece, i) => (
          <Piece key={piece.id} piece={piece} mx={mx} my={my} first={i === 0} />
        ))}
      </div>

      {/* grainline arrow, as printed on a paper pattern */}
      <svg
        aria-hidden="true"
        className="absolute -right-7 top-8 hidden h-40 w-4 sm:block"
        viewBox="0 0 16 160"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.2"
      >
        <path d="M8 4 V156 M3 12 L8 4 L13 12 M3 148 L8 156 L13 148" />
      </svg>

      <figcaption
        className="piece notched sheet-shadow absolute -bottom-7 -left-3 z-10 -rotate-3 bg-paper-light px-4 py-3 sm:-left-10"
        style={{ '--fx': '0px', '--fy': '24px', '--fr': '-3deg', '--delay': '900ms' }}
      >
        <span className="mono-label text-thread">{caption}</span>
      </figcaption>
    </figure>
  );
}
