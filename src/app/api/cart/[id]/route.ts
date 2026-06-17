import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { JwtPayload } from "@/lib/auth";
import { removeFromCart, updateCartItem } from "@/lib/service/cart.service";

// PUT /api/cart/:productId — update quantity
const putHandler = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const { id } = await params;
    const { quantity } = await req.json();
    const cart = await updateCartItem(payload.id, id, quantity);
    if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    return NextResponse.json(cart);
};

// DELETE /api/cart/:productId — remove item
const deleteHandler = async (
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    payload: JwtPayload
) => {
    const { id } = await params;
    const cart = await removeFromCart(payload.id, id);
    if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    return NextResponse.json(cart);
};

export const PUT = withAuth(putHandler, ["admin", "user"]);
export const DELETE = withAuth(deleteHandler, ["admin", "user"]);
