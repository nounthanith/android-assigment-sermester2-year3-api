/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/service/user.service";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, role } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields required" }, { status: 400 });
        }

        // check duplicate
        const existing = await userService.getOne({ email });
        if (existing) {
            return NextResponse.json({ message: "Email already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userService.create({ name, email, password: hashedPassword, role });

        return NextResponse.json({ message: "Registered successfully", user }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}