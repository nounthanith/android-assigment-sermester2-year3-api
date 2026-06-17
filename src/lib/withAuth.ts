import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JwtPayload } from "@/lib/auth";

type Role = "admin" | "user";

type Handler = (
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => Promise<NextResponse>;

export function withAuth(handler: Handler, roles: Role[] = []) {
    return async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
        const payload = verifyToken(req);

        if (!payload) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (roles.length > 0 && !roles.includes(payload.role)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        return handler(req, context, payload);
    };
}