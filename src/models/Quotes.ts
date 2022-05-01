import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    quote: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    dateUploaded: {
        type: Date,
        default: Date.now,
        required: true,
    }
})

export default mongoose.model("Quote", quoteSchema);