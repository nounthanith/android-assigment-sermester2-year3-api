import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { authService } from "@/lib/service/auth.service";

export async function GET(req: NextRequest) {
    try {
        const payload = verifyToken(req);

        if (!payload) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await authService.getCurrentUser(payload.id);
        return NextResponse.json(user);
    } catch (error: any) {
        const status = error.message === "User not found" ? 404 : 500;
        return NextResponse.json({ message: error.message || "Internal server error" }, { status });
    }
}