import * as mongoose from "mongoose";
import { IHashtag } from "../../../interfaces";

export const HashtagSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        unique: true,
        require: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    lastUpdatedDate: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Hashtag = mongoose.model<IHashtag>("Hashtag", HashtagSchema);
