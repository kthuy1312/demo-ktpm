
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config'

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: 'Token format invalid' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded; // Attach decoded user information to the request
        next();
    });
};