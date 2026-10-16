import { NextResponse } from 'next/server';

/**
 * Locale routing. Pages live under app/[locale]. English keeps clean URLs:
 * "/about" is rewritten to "/en/about" internally, and "/en/..." redirects to
 * the clean URL. Albanian is served only from "/sq/...", which visitors reach by
 * clicking SQ in the EN/SQ toggle. Locale-less paths are always English: no
 * cookie or Accept-Language redirect. An old "lang" cookie from the previous
 * sticky-locale logic is cleared.
 */
// Old standalone routes now live on Home as sections (one-page scroll).
const SECTION_ROUTES = {
  '/about': 'about',
  '/projects': 'projects',
  '/journey': 'journey',
  '/beyond-code': 'beyond-code',
  '/contact': 'contact',
};

export function proxy(request) {
  const { pathname, search } = request.nextUrl;

  const isSq = pathname === '/sq' || pathname.startsWith('/sq/');
  const bare = isSq || pathname === '/en' || pathname.startsWith('/en/') ? pathname.slice(3) || '/' : pathname;
  const section = SECTION_ROUTES[bare.replace(/\/+$/, '') || '/'];
  if (section) {
    const url = request.nextUrl.clone();
    url.pathname = isSq ? '/sq' : '/';
    url.search = '';
    url.hash = section;
    return NextResponse.redirect(url, 308);
  }

  if (pathname === '/sq' || pathname.startsWith('/sq/')) {
    return NextResponse.next();
  }

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || '/';
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? '/en' : `/en${pathname}`;
  url.search = search;
  const res = NextResponse.rewrite(url);
  if (request.cookies.has('lang')) res.cookies.delete('lang');
  return res;
}

export const config = {
  // Skip API routes, Next internals, metadata icons and any file with an extension.
  matcher: ['/((?!api|_next|icon|apple-icon|favicon|.*\\..*).*)'],
};
