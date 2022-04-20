import mongoose from "mongoose";

// Get a random document from a collection
export default function getRandomItem(collection) {
    const randomId = mongoose.Types.ObjectId();
    return collection.findOne({ _id: randomId });
    }