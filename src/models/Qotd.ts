import mongoose from "mongoose";

const qotdSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    quotd: {
        type: String,
        required: true,
    },
    dateUploaded: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

export default mongoose.model("Qotd", qotdSchema);