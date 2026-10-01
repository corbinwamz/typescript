import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthError } from "../utils/errors";

export function authMiddleware(req: Request,res: Response,next: NextFunction) {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(401).json({ success: false, message: "Missing or invalid token" });
        return;
    }
    const token = authorization.split(" ")[1];

    try {
        if (!token) {
            res.status(401).json({ success: false, message: "Missing or invalid token" });
            return;
        }
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        console.error(error);
        const status = error instanceof AuthError ? error.statusCode : 401;
        res.status(status).json({
            success: false,
            message: "Unable to retrieve token",
        })
    }
}