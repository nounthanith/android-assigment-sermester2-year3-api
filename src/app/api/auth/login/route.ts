import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/service/auth.service";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password required" }, { status: 400 });
        }

        const { user, token } = await authService.login(email, password);

        const response = NextResponse.json({
            message: "Login successful",
            user,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error: any) {
        const status = error.message === "User not found" ? 404 : 500;
        return NextResponse.json({ message: error.message || "Internal server error" }, { status });
    }
}