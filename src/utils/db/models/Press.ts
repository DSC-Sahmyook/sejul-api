import * as mongoose from "mongoose";

const PressSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    description: String,
    imgUrl: String,
    link: String,
    isDeleted: {
        type: Boolean,
        default: false,
    },
    lastUpdatedDate: {
        type: Date,
        default: Date.now,
    },
});

export const Press = mongoose.model("Press", PressSchema);
