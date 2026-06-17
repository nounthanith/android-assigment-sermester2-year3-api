/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { withAuth } from "@/lib/withAuth";

const uploadHandler = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ message: "No image provided" }, { status: 400 });
        }

        // validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ message: "Invalid file type" }, { status: 400 });
        }

        // validate file size (max 2MB)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ message: "File too large (max 2MB)" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadImage(buffer, "uploads");

        return NextResponse.json({ url });
    } catch (error) {
        return NextResponse.json({ message: "Upload failed" }, { status: 500 });
    }
};

export const POST = withAuth(uploadHandler, ["admin"]);