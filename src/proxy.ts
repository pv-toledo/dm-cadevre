import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/proxy';
 
const handleI18nRouting = createMiddleware(routing);
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export default async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  if (!response.ok) {
    return response;
  }

  const [, locale, ...rest] = new URL(
    response.headers.get("x-middleware-rewrite") || request.url
  ).pathname.split("/");
  const pathname = "/" + rest.join("/");

  return updateSession(request, response, locale, pathname);
}
