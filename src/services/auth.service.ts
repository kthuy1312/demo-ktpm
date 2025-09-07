import jwt from "jsonwebtoken";
import 'dotenv/config';
import { prisma } from "config/client";
import bcrypt from 'bcrypt';


const hashPassword = async (plainText: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(plainText, saltRounds)
}

const generateToken = (user: any) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.username,
            role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "3h" }
    );
}

const isEmailExist = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email }
    })
    if (user) return true;
    return false;
}


const createUser = async (name: string, email: string, password: string) => {
    const newPwd = await hashPassword(password)
    return await prisma.user.create({
        data: {
            name,
            email,
            password: newPwd
        }
    })
}

const getUserSumCart = async (user_id: number) => {
    const user = await prisma.cart.findUnique({
        where: { user_id: user_id },
    });


    return user?.sum ?? 0;
}

export { generateToken, isEmailExist, createUser, hashPassword, getUserSumCart }
