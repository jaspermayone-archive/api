import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const scamEmailSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4(),
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    reportedBy: {
        type: String,
        required: true,
    },
    reportedByID: {
        type: String,
    },
    dateReported: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

export default mongoose.model("ScamEmail", scamEmailSchema);