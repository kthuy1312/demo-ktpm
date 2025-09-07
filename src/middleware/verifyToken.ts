
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config'

//mã hóa token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'Xin vui lòng đăng nhập' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: 'Định dạng token không hợp lệ, vui lòng đăng nhập lại' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại' });
        }
        req.user = decoded as Express.User; // Attach decoded user information to the request
        next();
    });
};