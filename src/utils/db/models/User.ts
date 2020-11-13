import * as mongoose from "mongoose";
import * as passportLocalMongoose from "passport-local-mongoose";
import { IUser } from "../../../interfaces";

export const UserSchema = new mongoose.Schema({
    // 사용자 이메일
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    // 비밀번호
    password: {
        type: String,
        required: true,
    },
    // 실제 사용되는 사용자 명
    username: String,
    // 소셜 로그인시 토큰
    tokens: {
        kakao: String,
        facebook: String,
        google: String,
        naver: String,
    },
    profile: String,
    // 팔로잉 유저
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // 관심 해시태그
    hashtag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hashtag" }],
    // 추가한 기사,
    articles: [
        {
            // 기사 제목
            title: { type: String, require: true },
            // 네이버 기준 링크
            link: { type: String, require: true },
            // 언론사 기준 링크
            originalLink: {
                type: String,
                require: true,
            },
        },
    ],
    // 삭제 여부
    isDeleted: {
        type: Boolean,
        default: false,
    },
    // 관리자 여부
    isAdmin: {
        type: Boolean,
        default: false,
    },
    // 마지막 수정일자
    lastUpdatedDate: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

export const User = mongoose.model<IUser>("User", UserSchema);
