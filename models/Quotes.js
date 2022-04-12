import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const quoteSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4(),
        required: true,
    },
    quote: {
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
