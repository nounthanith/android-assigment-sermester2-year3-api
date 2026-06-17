/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/service/product.service";
import { withAuth } from "@/lib/withAuth";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { Buffer } from "buffer";
import { JwtPayload } from "@/lib/auth";

const getHandler = async (
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const { id } = await params;
    const product = await productService.getById(id);
    if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(product);
};

const putHandler = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const { id } = await params;
    const formData = await req.formData();

    const data: Record<string, any> = {};

    const fields = ["name", "description", "category"];
    fields.forEach((f) => {
        const val = formData.get(f);
        if (val) data[f] = val;
    });

    if (formData.get("price")) data.price = Number(formData.get("price"));
    if (formData.get("stock")) data.stock = Number(formData.get("stock"));

    // handle new image
    const file = formData.get("image") as File | null;
    if (file && file.size > 0) {
        // delete old image
        const existing = await productService.getById(id) as unknown;
        if ((existing as any)?.image) await deleteImage((existing as any).image);

        const buffer = Buffer.from(await file.arrayBuffer());
        data.image = await uploadImage(buffer, "products");
    }

    const product = await productService.update(id, data);
    if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(product);
};

const deleteHandler = async (
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const { id } = await params;
    const product = await productService.delete(id);
    if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
};

export const GET = withAuth(getHandler, ["admin", "user"]);
export const PUT = withAuth(putHandler, ["admin"]);
export const DELETE = withAuth(deleteHandler, ["admin"]);