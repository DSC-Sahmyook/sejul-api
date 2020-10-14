import * as mongoose from "mongoose";

const SummarySchema = new mongoose.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
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
});

export const Summary = mongoose.model("Summary", SummarySchema);
