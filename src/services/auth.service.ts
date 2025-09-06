import jwt from "jsonwebtoken";
import 'dotenv/config';
import { prisma } from "config/client"

const generateToken = (user: any) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.username,
            role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );
}

const isEmailExist = (email: string) => {
    const user = prisma.user.findUnique({
        where: { email }
    })
    if (user) return true;
    return false;
}

export { generateToken, isEmailExist }
