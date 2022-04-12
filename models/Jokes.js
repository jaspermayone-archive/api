import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// create scam link model
const jokeSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4(),
        required: true,
    },
    joke: {
        type: String,
        required: true,
    },
    dateUploaded: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

// export model
export default mongoose.model("Joke", jokeSchema);
