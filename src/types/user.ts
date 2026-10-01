import { User } from "../generated/prisma/client";

export type PublicUser = Omit<User, "hashedPassword">;
export type NewUser = Omit<User, "id" | "createdAt">;
export type UpdateProfileBody = Partial<Pick<User, "username" | "email">>;