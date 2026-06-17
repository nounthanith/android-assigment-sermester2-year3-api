/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCRUD } from "@/lib/crud.service";
import { connectDB } from "@/lib/db";
import Cart from "@/models/cart.model";

// basic CRUD (getById, delete, etc.)
export const cartService = createCRUD(Cart);

// custom cart logic
export async function getMyCart(userId: string) {
    await connectDB();
    return await Cart.findOne({ user: userId })
        .populate("items.product")
        .lean();
}

export async function addToCart(
    userId: string,
    productId: string,
    quantity: number,
    price: number
) {
    await connectDB();

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity, price }],
            totalPrice: price * quantity,
        });
        return cart;
    }

    const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({ product: productId as any, quantity, price });
    }

    cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );

    await cart.save();
    return cart;
}

export async function updateCartItem(
    userId: string,
    productId: string,
    quantity: number
) {
    await connectDB();

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return null;

    const item = cart.items.find(
        (item) => item.product.toString() === productId
    );
    if (!item) return null;

    if (quantity <= 0) {
        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );
    } else {
        item.quantity = quantity;
    }

    cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );

    await cart.save();
    return cart;
}

export async function removeFromCart(userId: string, productId: string) {
    await connectDB();

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return null;

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );

    await cart.save();
    return cart;
}

export async function clearCart(userId: string) {
    await connectDB();
    return await Cart.findOneAndUpdate(
        { user: userId },
        { items: [], totalPrice: 0 },
        { new: true }
    );
}