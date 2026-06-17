import { createCRUD } from "@/lib/crud.service";
import Product from "@/models/product.model";

export const productService = createCRUD(Product);