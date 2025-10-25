import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const protectedRoutes = ["/dashboard", "/profile"];
    const publicRoutes = ["/login", "/signup", "/"];

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );
    const isPublicRoute = publicRoutes.includes(pathname);

    const accessToken = request.cookies.get("accessToken")?.value;

    if (isProtectedRoute && !accessToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isPublicRoute && accessToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
