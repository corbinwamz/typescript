import jwt from "jsonwebtoken";
import { AuthError } from "./errors";

function getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("Secret is not set");
    } else {
        return secret;
    }
}

export interface TokenPayload {
    userId: string;
}

export function generateToken(userId: string): string {
    const secret = getSecret();
    return jwt.sign({ userId }, secret, { expiresIn: "1h" });
}

export function verifyToken(token: string): TokenPayload {
    const secret = getSecret();
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "string") {
        throw new AuthError("decoded is a string");
    } else if (typeof decoded.userId != "string"){
        throw new AuthError("decoded user id is not a string");
    } else {
        return { userId: decoded.userId };
    }
}