import { connectDB } from "@/lib/db";
import { Model, UpdateQuery } from "mongoose";

export function createCRUD<T>(model: Model<T>) {
    return {
        async create(data: Partial<T>) {
            await connectDB();
            return await model.create(data);
        },

        async getAll(filter: Record<string, object> = {}) {
            await connectDB();
            return await model.find(filter).lean();
        },

        async getById(id: string) {
            await connectDB();
            return await model.findById(id).lean();
        },

        async getOne(filter: Record<string, object>) {
            await connectDB();
            return await model.findOne(filter).lean();
        },

        async update(id: string, data: UpdateQuery<T>) {
            await connectDB();
            return await model.findByIdAndUpdate(id, data, { new: true }).lean();
        },

        async delete(id: string) {
            await connectDB();
            return await model.findByIdAndDelete(id).lean();
        },
    };
}