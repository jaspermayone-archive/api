import mongoose from "mongoose";

const scamLinkSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    reportedBy: {
        type: String,
        required: true,
    },
    reportedByID: {
        type: String,
        required: true,
    },
    dateReported: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

export default mongoose.model("ScamLink", scamLinkSchema);