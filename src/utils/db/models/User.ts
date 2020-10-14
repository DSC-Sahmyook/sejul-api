import * as mongoose from "mongoose";
import * as passportLocalMongoose from "passport-local-mongoose";

export const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: String,
    tokens: {
        kakao: String,
        facebook: String,
        google: String,
        naver: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    lastUpdatedDate: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

export const User = mongoose.model("User", UserSchema);
