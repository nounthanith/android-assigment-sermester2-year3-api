/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/service/user.service";
import { withAuth } from "@/lib/withAuth";
import { JwtPayload } from "@/lib/auth";

// only admin can get all users
const getHandler = async (
    req: NextRequest,
    _: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const users = await userService.getAll();
    return NextResponse.json(users);
};

// only admin can create user
const postHandler = async (
    req: NextRequest,
    _: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const body = await req.json();
    const user = await userService.create(body);
    return NextResponse.json(user, { status: 201 });
};

export const GET = withAuth(getHandler, ["admin"]);
export const POST = withAuth(postHandler, ["admin"]);