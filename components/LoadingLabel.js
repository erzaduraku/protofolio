'use client';

import { useLocale } from './LocaleProvider';
import { getDict } from '@/lib/i18n';

/** "Loading…" in the page language (loading.js files get no params). */
export default function LoadingLabel() {
  return getDict(useLocale()).common.loading;
}
