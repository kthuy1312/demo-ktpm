
import { loginWithJWT, postRegister } from 'controllers/client/auth-controller'
import express, { Express } from 'express'
import passport from 'passport'

// import fileUploadMiddleware from 'src/middleware/multer'
const router = express.Router()

const authRouter = (app: Express) => {

    router.post('/login',
        passport.authenticate("local", { session: false }),
        loginWithJWT
    );
    router.post('/register', postRegister)

    app.use("/auth", router)
}

export default authRouter
