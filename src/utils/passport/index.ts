import * as Strategies from "./strategies";
import * as Models from "../db/models";
import * as passport from "passport";
import { IUser } from "../../interfaces";

export default (_passport: passport.PassportStatic) => {
    _passport.use(Strategies.local);
    _passport.use(Strategies.jwt);
    _passport.use(Strategies.kakao);

    _passport.serializeUser((user: IUser, done) => {
        // done(null, user);
        done(null, user._id);
    });

    _passport.deserializeUser(async (user_id: string, done) => {
        // done(null, user);
        const user = await Models.User.findOne({ _id: user_id });
        done(null, user);
    });
};
