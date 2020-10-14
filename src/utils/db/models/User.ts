import * as mongoose from "mongoose";
import * as passportLocalMongoose from "passport-local-mongoose";

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
    // 관심 키워드
    keywords: [String],
    // 팔로잉 유저
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    interestPress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Press",
        },
    ],
    // 관심 카테고리
    interestCategories: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ],
    // 비관심 카테고리
    notInterestCategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
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
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

export const User = mongoose.model("User", UserSchema);
