import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribe to a CSS media query from a Client Component.
 * useSyncExternalStore = no setState-in-effect, and the server snapshot is
 * always false, so SSR output never depends on the visitor's device.
 *
 * Used for: prefers-reduced-motion, and "fine pointer" checks (cursor, parallax).
 */
export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', callback);
      return () => media.removeEventListener('change', callback);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
export const FINE_POINTER_MOTION =
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
