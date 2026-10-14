import { NextResponse } from 'next/server';

/**
 * Locale routing. Pages live under app/[locale]. English keeps clean URLs:
 * "/about" is rewritten to "/en/about" internally, and "/en/..." redirects to
 * the clean URL. Albanian is served from "/sq/...". A visitor who picked SQ
 * (cookie "lang=sq", set by the EN/SQ toggle) is sent from "/..." to "/sq/...".
 */
export function proxy(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname === '/sq' || pathname.startsWith('/sq/')) {
    return NextResponse.next();
  }

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || '/';
    return NextResponse.redirect(url);
  }

  if (request.cookies.get('lang')?.value === 'sq') {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? '/sq' : `/sq${pathname}`;
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? '/en' : `/en${pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals, metadata icons and any file with an extension.
  matcher: ['/((?!api|_next|icon|apple-icon|favicon|.*\\..*).*)'],
};
