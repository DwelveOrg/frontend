import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "./app/(authentication)/_constants/session";
import { protectedRoutes, publicRoutes} from "./app/(authentication)/_constants/routes";
import { decryptSession } from './app/(authentication)/_lib/session-token';

function isRouteMatch(path: string, routes: readonly string[]) {
    return routes.some((route) => path === route || path.startsWith(`${route}/`));
}

export default async function proxy(req: NextRequest){
    const path = req.nextUrl.pathname;
    const isProtectedRoute = isRouteMatch(path, protectedRoutes)
    const isPublicRoute = isRouteMatch(path, publicRoutes)

    const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value
    const session = await decryptSession(cookie)

    if(isProtectedRoute && !session?.userId){
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if(isPublicRoute && session?.userId){
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next();
}

/**
 * Skip the proxy for static assets and Next internals so session decryption only
 * runs on real navigations. Keeps request handling cheap and reduces surface.
 */
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
