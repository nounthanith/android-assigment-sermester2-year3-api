import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userService } from "./user.service";
import { IUser } from "@/models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_this";

export interface AuthResponse {
    user: Partial<IUser> & { id: string; token: string };
    token: string;
}

export const authService = {
    async register(data: { name: string; email: string; password: string; role?: "admin" | "user" }) {
        const { name, email, password, role } = data;

        // check duplicate
        const existing = await userService.getOne({ email });
        if (existing) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userService.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        return user;
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const user = await userService.getOne({ email }) as any;
        if (!user) {
            throw new Error("User not found");
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const safeUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token
        };

        return { user: safeUser, token };
    },

    async getCurrentUser(id: string) {
        const user = await userService.getById(id) as any;
        if (!user) {
            throw new Error("User not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeUser } = user;
        return safeUser;
    }
};
