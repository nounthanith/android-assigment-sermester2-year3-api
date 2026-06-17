import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/lib/service/category.service";
import { withAuth } from "@/lib/withAuth";
import { JwtPayload } from "@/lib/auth";

const getHandler = async (
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const { id } = await params;
    const category = await categoryService.getById(id);
    if (!category) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(category);
};

const putHandler = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const { id } = await params;
    const body = await req.json();

    // check duplicate name
    if (body.name) {
        const existing = await categoryService.getOne({ name: body.name });
        if (existing && (existing as unknown as { _id: string })._id.toString() !== id) {
            return NextResponse.json({ message: "Category name already exists" }, { status: 409 });
        }
    }

    const category = await categoryService.update(id, body);
    if (!category) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(category);
};

const deleteHandler = async (
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const { id } = await params;
    const category = await categoryService.delete(id);
    if (!category) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
};

export const GET = withAuth(getHandler, ["admin", "user"]);
export const PUT = withAuth(putHandler, ["admin"]);
export const DELETE = withAuth(deleteHandler, ["admin"]);