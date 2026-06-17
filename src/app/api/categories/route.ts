import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/lib/service/category.service";
import { withAuth } from "@/lib/withAuth";
import { JwtPayload } from "@/lib/auth";

const getHandler = async (
    req: NextRequest,
    _: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const categories = await categoryService.getAll({ isActive: { $eq: true } });
    return NextResponse.json(categories);
};

const postHandler = async (
    req: NextRequest,
    _: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const body = await req.json();

    // check duplicate name
    const existing = await categoryService.getOne({ name: body.name });
    if (existing) {
        return NextResponse.json({ message: "Category already exists" }, { status: 409 });
    }

    const category = await categoryService.create(body);
    return NextResponse.json(category, { status: 201 });
};

export const GET = withAuth(getHandler, ["admin", "user"]);
export const POST = withAuth(postHandler, ["admin"]);