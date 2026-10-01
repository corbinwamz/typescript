import { User, PrismaClient } from "../generated/prisma/client";
import { NewUser, UpdateProfileBody, PublicUser } from "../types/user";

export const prisma = new PrismaClient();

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email : email } });
}

export async function findUserById(id: string) {
    return prisma.user.findUnique({ where: { id : id } });
}

export async function addUser(user: NewUser) {
    return prisma.user.create({ data: user });
}

export async function updateUser(id: string, data: UpdateProfileBody) {
    return prisma.user.update({ where: { id }, data });
}
// Array: returns a list of users (without password hashes).
export async function findAllUsers(): Promise<PublicUser[]> {
    const users = await prisma.user.findMany({ omit: { hashedPassword: true } });
    return users;
}
