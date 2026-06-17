import { createCRUD } from "@/lib/crud.service";
import Category from "@/models/category.model";

export const categoryService = createCRUD(Category);