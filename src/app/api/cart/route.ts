/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { JwtPayload } from "@/lib/auth";
import { getMyCart, addToCart, clearCart } from "@/lib/service/cart.service";

// GET /api/cart — get my cart
const getHandler = async (
    _: NextRequest,
    context: any,
    payload: JwtPayload
) => {
    const cart = await getMyCart(payload.id);
    return NextResponse.json(cart ?? { items: [], totalPrice: 0 });
};

// POST /api/cart — add item to cart
const postHandler = async (
    req: NextRequest,
    context: any,
    payload: JwtPayload
) => {
    const { productId, quantity, price } = await req.json();

    if (!productId || !price) {
        return NextResponse.json({ message: "productId and price required" }, { status: 400 });
    }

    const cart = await addToCart(payload.id, productId, quantity ?? 1, price);
    return NextResponse.json(cart);
};

// DELETE /api/cart — clear cart
const deleteHandler = async (
    _: NextRequest,
    context: any,
    payload: JwtPayload
) => {
    const cart = await clearCart(payload.id);
    return NextResponse.json(cart);
};

export const GET = withAuth(getHandler, ["admin", "user"]);
export const POST = withAuth(postHandler, ["admin", "user"]);
export const DELETE = withAuth(deleteHandler, ["admin", "user"]);