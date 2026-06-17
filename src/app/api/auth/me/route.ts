/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { userService } from "@/lib/service/user.service";

export async function GET(req: NextRequest) {
    try {
        const payload = verifyToken(req);

        if (!payload) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await userService.getById(payload.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // remove password from response
        const { password, ...safeUser } = user as any;

        return NextResponse.json(safeUser);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}