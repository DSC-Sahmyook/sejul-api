import * as mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    link: String,
    originALink: String,
    description: String,
    pubDate: Date,
    press: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Press",
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
    isDeleted: Boolean,
    lastUpdatedDate: {
        type: Date,
        default: Date.now,
    },
});

export const Article = mongoose.model("Article", articleSchema);
