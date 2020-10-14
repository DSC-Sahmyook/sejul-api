import { Strategy } from "passport-local";
import * as Models from "../../db/models";
import * as bcrypt from "bcrypt";

import * as UTILS from "../../../utils";

const env = UTILS.ENV();

export default new Strategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    async (email: string, password: string, cb: Function) => {
        try {
            console.log("in strategy");
            const user = await Models.User.findOne({
                email: email,
            });

            if (user) {
                const _userObj = user.toObject();
                if (bcrypt.compareSync(password, _userObj.password)) {
                    cb(null, user, {
                        message: "로그인이 성공했습니다",
                    });
                } else {
                    cb(null, null, {
                        message: "이메일 혹은 패스워드가 잘못됐습니다",
                    });
                }
            } else {
                cb(null, null, {
                    message: "이메일 혹은 패스워드가 잘못됐습니다",
                });
            }
        } catch (e) {
            cb(e);
        }
    }
);
