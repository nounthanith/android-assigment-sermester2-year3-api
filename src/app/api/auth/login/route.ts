/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userService } from "@/lib/service/user.service";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password required" }, { status: 400 });
        }

        // check user exists
        const user = await userService.getOne({ email });
        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // check password
        const isMatch = await bcrypt.compare(password, (user as any).password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // generate token
        const token = jwt.sign(
            { id: (user as any)._id, role: (user as any).role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // set httpOnly cookie
        const response = NextResponse.json({
            message: "Login successful",
            user: {
                id: (user as any)._id,
                name: (user as any).name,
                email: (user as any).email,
                role: (user as any).role,
                token: token, 
            },
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;

    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}