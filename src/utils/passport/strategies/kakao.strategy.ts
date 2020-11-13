import { Strategy, Profile } from "passport-kakao";
import * as Model from "../../db/models";
import * as bcrypt from "bcrypt";
import * as UTILS from "../../../utils";

const _env = UTILS.ENV();

const CALLBACK_URL = `${_env.get(
    "CURRENT_SERVER_HOST_URL"
)}/api/auth/kakao/callback`;

interface IKakaoJSON {
    connected_at: Date;
    id: Number;
    kakao_account: {
        email: string;
        email_needs_agreement: boolean;
        has_email: boolean;
        is_email_valid: boolean;
        is_email_verified: boolean;
        profile: Profile;
        profile_needs_agreement: boolean;
    };
    properties: {
        nickname: string;
        profile_image: string;
        thumbnail_image: string;
    };
}

export interface IKakaoStrategyInfo {
    profile: IExpandKakaoProfile;
    token: String;
}

export interface IExpandKakaoProfile extends Profile {
    _json: IKakaoJSON;
}

export default new Strategy(
    {
        clientID: _env.get("KAKAO_API_CLIENT_ID"),
        clientSecret: _env.get("KAKAO_API_CLIENT_SECRET"),
        callbackURL: CALLBACK_URL,
    },
    async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any, info?: any) => void
    ) => {
        try {
            const userFromToken = await Model.User.findOne({
                "tokens.kakao": profile.id,
            });
            done(null, userFromToken, {
                profile: profile,
                token: accessToken,
            });
        } catch (e) {
            done(e);
        }
    }
);
