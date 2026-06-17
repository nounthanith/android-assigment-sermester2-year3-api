// lib/services/user.service.ts
import { createCRUD } from "@/lib/crud.service";
import User from "@/models/user.model";

export const userService = createCRUD(User);