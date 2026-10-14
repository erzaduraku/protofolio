'use client';

import { createContext, useContext } from 'react';

/** The locale comes from the [locale] route segment, so server and client always agree. */
const LocaleContext = createContext('en');

export default function LocaleProvider({ locale, children }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
