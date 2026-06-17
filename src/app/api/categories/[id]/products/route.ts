import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/service/product.service";
import { withAuth } from "@/lib/withAuth";

const getHandler = async (
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;
    const products = await productService.getAll({ category: { $eq: id }, isActive: { $eq: true } });
    return NextResponse.json(products);
};

export const GET = withAuth(getHandler, ["admin", "user"]);