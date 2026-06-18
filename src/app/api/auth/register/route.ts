import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/service/auth.service";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        if (!data.name || !data.email || !data.password) {
            return NextResponse.json({ message: "All fields required" }, { status: 400 });
        }

        const user = await authService.register(data);
        return NextResponse.json({ message: "Registered successfully", user }, { status: 201 });
    } catch (error: any) {
        const status = error.message === "Email already exists" ? 409 : 500;
        return NextResponse.json({ message: error.message || "Internal server error" }, { status });
    }
}