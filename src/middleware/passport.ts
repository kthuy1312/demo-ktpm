import { prisma } from "config/client";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import 'dotenv/config';

import { comparePassword } from "services/user-service";

const configPassport = () => {

    // Local Strategy
    passport.use(new LocalStrategy({

        passReqToCallback: true // giúp có thể lấy đươc req, truyền req vào verify

    }, async function verify(req, username, password, callback) {

        //refesh lại messages lỗi khi login

        //check user exist in db
        const user = await prisma.user.findUnique({ where: { email: username } })
        if (!user) {
            return callback(null, false, { message: 'Incorrect email.' });
        }
        //check pwd
        const isMatch = await comparePassword(password, user.password)
        if (!isMatch) {
            return callback(null, false, { message: 'Incorrect password.' });
        }
        return callback(null, user as any);

    }));

    // JWT Strategy
    passport.use(new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET!,
        },
        async (payload, done) => {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id: payload.id,
                    },
                });
                if (!user) return done(null, false);
                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        }
    ));

}

export default configPassport