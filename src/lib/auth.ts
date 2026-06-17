import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface JwtPayload {
    id: string;
    role: "admin" | "user";
}

export function verifyToken(req: NextRequest): JwtPayload | null {
    try {
        // check header first (for mobile/android)
        const authHeader = req.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            return jwt.verify(token, JWT_SECRET) as JwtPayload;
        }

        // fallback to cookie (for web)
        const token = req.cookies.get("token")?.value;
        if (!token) return null;
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}