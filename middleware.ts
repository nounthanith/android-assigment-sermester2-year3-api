import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/admin"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
    if (!isProtected) return NextResponse.next();

    const payload = verifyToken(req);
    if (!payload) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // admin only
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};