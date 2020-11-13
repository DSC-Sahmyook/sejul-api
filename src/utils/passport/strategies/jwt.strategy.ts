import { Strategy, ExtractJwt } from "passport-jwt";
import * as bcrypt from "bcrypt";
import * as Models from "../../db/models";
import customEnv from "../../env";
import { IUser } from "../../../interfaces";
const _env = customEnv();

export default new Strategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: _env.get("JWT_SECRET"),
    },
    async function (payload, done) {
        try {
            // 패스워드 변경 시 토큰이 정상 처리 되지 않도록 하기 위함
            const user = await Models.User.findOne({
                _id: payload._id,
            });
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }
);
