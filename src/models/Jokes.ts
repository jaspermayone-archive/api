import mongoose from "mongoose";

// create scam link model
const jokeSchema = new mongoose.Schema({
    _id: {
        type: String,
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
