/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/service/product.service";
import { uploadImage } from "@/lib/cloudinary";
import { withAuth } from "@/lib/withAuth";
import { JwtPayload } from "@/lib/auth";

const getHandler = async (
    req: NextRequest,
    _: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";

    const filter: Record<string, object> = { isActive: { $eq: true } };

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    const products = await productService.getAll(filter);
    return NextResponse.json(products);
};

const postHandler = async (
    req: NextRequest,
    _: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const stock = Number(formData.get("stock"));
    const file = formData.get("image") as File | null;

    let imageUrl = "";
    if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        imageUrl = await uploadImage(buffer, "products");
    }

    const product = await productService.create({
        name,
        description,
        price,
        category: category as any,
        stock,
        image: imageUrl,
    });

    return NextResponse.json(product, { status: 201 });
};

export const GET = withAuth(getHandler, ["admin", "user"]);
export const POST = withAuth(postHandler, ["admin"]);