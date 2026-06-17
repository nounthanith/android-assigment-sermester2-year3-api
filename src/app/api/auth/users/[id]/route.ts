import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/service/user.service";
import { withAuth } from "@/lib/withAuth";
import { JwtPayload } from "@/lib/auth";

// admin can get any user, user can only get themselves
const getHandler = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const { id } = await params;

    if (payload.role !== "admin" && payload.id !== id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const user = await userService.getById(id);
    if (!user) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(user);
};

// admin can update any, user can only update themselves
const putHandler = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const { id } = await params;

    if (payload.role !== "admin" && payload.id !== id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const user = await userService.update(id, body);
    if (!user) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(user);
};

// only admin can delete
const deleteHandler = async (
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const { id } = await params;
    const user = await userService.delete(id);
    if (!user) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
};

export const GET = withAuth(getHandler, ["admin", "user"]);
export const PUT = withAuth(putHandler, ["admin", "user"]);
export const DELETE = withAuth(deleteHandler, ["admin"]);