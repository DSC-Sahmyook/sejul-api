import * as mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    lastUpdatedDate: {
        type: Date,
        default: Date.now,
    },
});

export const Category = mongoose.model("Category", CategorySchema);
