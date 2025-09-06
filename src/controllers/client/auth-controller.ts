import { Request, Response } from "express";
import { generateToken } from "services/auth.service";
import { RegisterSchema, TRegisterSchema } from "src/validation/register.schema";

const loginWithJWT = (req: Request, res: Response) => {
    const user = req.user as any; // Passport gắn vào
    if (!user) {
        return res.status(401).json({ message: "Email / Password không đúng" });
    }

    const token = generateToken(user);
    return res.json({
        message: "Login successful",
        token,
    });
}

const postRegister = async (req: Request, res: Response) => {
    const { fullName, email, password, confirmPassword } = req.body as TRegisterSchema
    const validate = await RegisterSchema.safeParseAsync(req.body)
    return validate

}

export { loginWithJWT, postRegister }
