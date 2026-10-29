// Moved from lib/useMediaQuery.js: all custom hooks now live in hooks/ (kebab-case, like use-active-section.js).
import { useCallback, useSyncExternalStore } from 'react';

/** Server snapshot is always false, so SSR output never depends on the device. */
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
