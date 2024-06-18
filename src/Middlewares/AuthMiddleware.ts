import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: "JWT token required" });

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET!);

        req.body.user = user;

        return next();
    } catch {
        return res.status(403).json({ message: "Invalid token" });
    }
};

export default AuthMiddleware;
