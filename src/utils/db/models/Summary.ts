import * as mongoose from "mongoose";
import { ISummary } from "../../../interfaces";

const SummarySchema = new mongoose.Schema({
    article: {
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        trim: true,
    },
    timestamp: {
        start: Date,
        finish: Date,
    },
    views: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            viewDate: { type: Date, default: Date.now },
        },
    ],
    rates: [
        {
            score: {
                type: Number,
                min: 0,
                max: 5,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            rateDate: {
                type: Date,
                default: Date.now,
            },
        },
    ],
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

export const Summary = mongoose.model<ISummary>("Summary", SummarySchema);
